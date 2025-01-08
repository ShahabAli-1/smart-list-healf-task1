"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { YelpItem } from "@/types";
import { BUFFER_SIZE, ITEM_HEIGHT, WINDOW_SIZE } from "@/constants";
import SmartListItem from "./shared/SmartListItem";

export default function SmartListInfiniteScroll() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [allItems, setAllItems] = useState<YelpItem[]>([]);
  const [visibleWindow, setVisibleWindow] = useState<YelpItem[]>([]);
  const [total, setTotal] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const debouncedQuery = useDebounce(query, 700);

  const fetchData = async (searchQuery = "", pageNumber = 1) => {
    if (!loading && (pageNumber * 100 <= total || pageNumber === 1)) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(
            searchQuery
          )}&page=${pageNumber}&limit=100`
        );
        const data = await response.json();
        setTotal(data.total);
        setAllItems((prev) => {
          const newItems = data.results as YelpItem[];
          return pageNumber === 1 ? newItems : [...prev, ...newItems];
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateVisibleWindow = useCallback(() => {
    if (!listRef.current) return;

    const scrollTop = listRef.current.scrollTop;
    const currentIndex = Math.floor(scrollTop / ITEM_HEIGHT);

    // Calculate the range of items to display including buffer
    const start = Math.max(0, currentIndex - BUFFER_SIZE);
    const end = Math.min(
      allItems.length,
      currentIndex + WINDOW_SIZE + BUFFER_SIZE
    );

    // Update visible window with buffer zones
    const itemsToShow = allItems.slice(start, end);
    setVisibleWindow(itemsToShow);

    // Calculate and apply transform
    const transformValue = start * ITEM_HEIGHT;
    const itemsContainer = listRef.current.querySelector(
      ".items-container"
    ) as HTMLElement;
    if (itemsContainer) {
      itemsContainer.style.transform = `translateY(${transformValue}px)`;
    }

    // Check if we need to load more items
    const { scrollHeight, clientHeight } = listRef.current;
    const LOAD_MORE_THRESHOLD = ITEM_HEIGHT * BUFFER_SIZE; // Adjust as needed

    if (
      scrollHeight - scrollTop - clientHeight < LOAD_MORE_THRESHOLD &&
      !loading &&
      page * 100 <= total
    ) {
      setPage((prev) => prev + 1);
    }

    lastScrollTop.current = scrollTop;
  }, [allItems, loading, page, total]);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateVisibleWindow);
  }, [updateVisibleWindow]);

  useEffect(() => {
    if (debouncedQuery === "") {
      setPage(1);
      setAllItems([]);
      setVisibleWindow([]);
      fetchData("", 1);
    } else if (debouncedQuery) {
      setPage(1);
      setAllItems([]);
      setVisibleWindow([]);
      fetchData(debouncedQuery, 1);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    updateVisibleWindow();
  }, [allItems, updateVisibleWindow]);

  useEffect(() => {
    if (page > 1) {
      fetchData(debouncedQuery, page);
    }
  }, [page, debouncedQuery]);

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 max-h-screen flex flex-col items-center rounded-md">
      <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">
        Smart List
      </h1>
      <div className="w-full sm:w-96 md:w-1/2 lg:w-1/3 mb-6 flex justify-center sticky top-4 z-10">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 border-2 text-black border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out bg-white"
        />
      </div>
      <div
        ref={listRef}
        className="w-full max-w-2xl overflow-auto scroll-smooth"
        style={{ height: "calc(100vh - 200px)" }}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: `${allItems.length * ITEM_HEIGHT}px`,
            position: "relative",
          }}
        >
          <div
            className="items-container"
            style={{
              position: "absolute",
              width: "100%",
              willChange: "transform",
            }}
          >
            <ul className="px-4 w-full flex flex-col gap-2 items-center">
              {visibleWindow.map((item) => (
                <SmartListItem key={item.ID} item={item} />
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={observerTarget}
          className="h-10 flex justify-center items-center"
        >
          {loading && (
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
}
