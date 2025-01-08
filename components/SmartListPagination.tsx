"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { YelpItem } from "@/types";
import { AppDispatch } from "@/store";
import useDebounce from "@/hooks/useDebounce";
import {
  setItemsByPage,
  setLoading,
  setTotal,
  clearItemsByPage,
} from "@/store/slices/smartListSlice";
import { RootState } from "@/store";
import SmartListItem from "./shared/SmartListItem";
import { Loader2 } from "lucide-react";

export default function SmartListPagination() {
  const dispatch = useDispatch<AppDispatch>();
  const { itemsByPage, loading, total } = useSelector(
    (state: RootState) => state.smartList
  );

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Use the custom debounce hook to delay the API call
  const debouncedQuery = useDebounce(query, 700);

  const fetchData = async (searchQuery = "", pageNumber = 1) => {
    if (searchQuery.trim()) {
      dispatch(setLoading(true));

      try {
        const response = await axios.get(`/api/search`, {
          params: { q: searchQuery, page: pageNumber, limit: 100 },
        });

        // Store the fetched items for the page in Redux
        dispatch(
          setItemsByPage({
            page: pageNumber,
            items: response.data.results as YelpItem[],
          })
        );

        // Set total count in Redux state
        dispatch(setTotal(response.data.total));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      if (!itemsByPage[pageNumber]) {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`/api/search`, {
            params: { q: "", page: pageNumber, limit: 100 },
          });

          // Store the fetched items for the page in Redux
          dispatch(
            setItemsByPage({
              page: pageNumber,
              items: response.data.results as YelpItem[],
            })
          );

          // Set total count in Redux state
          dispatch(setTotal(response.data.total));
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    }
  };

  useEffect(() => {
    if (debouncedQuery === "") {
      dispatch(clearItemsByPage());
      setPage(1);
      fetchData("", 1);
    } else {
      if (debouncedQuery) {
        dispatch(clearItemsByPage());
        setPage(1);
      }
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    if (!itemsByPage[page]) {
      fetchData(debouncedQuery, page);
    }
  }, [debouncedQuery, page, itemsByPage]);

  const currentItems = itemsByPage[page] || [];

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full sm:w-96 md:w-1/2 lg:w-1/3 mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
        />
      </div>

      <div className="w-full max-w-4xl space-y-6 px-4">
        {loading ? (
          <div className="flex justify-center items-center w-full h-64 bg-white rounded-xl shadow-md">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <ul className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {currentItems.map((item) => (
              <SmartListItem key={item.ID} item={item} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 w-full max-w-4xl flex justify-between items-center">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage(page - 1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <p className="text-gray-600 text-sm">
          Page {page} of {Math.ceil(total / 100)}
        </p>

        <button
          disabled={page * 100 >= total || loading}
          onClick={() => setPage(page + 1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
