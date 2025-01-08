import SmartListInfiniteScroll from "@/components/SmartListInfiniteScroll";
import SmartListPagination from "@/components/SmartListPagination";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-2 sm:p-2">
        <div className="bg-white shadow-lg rounded-md">
          {/* Infinte Scroll Implementation of the SmartList Component */}
          <SmartListInfiniteScroll />
          {/* Pagination Based Implementation of the SmartList Component */}
          {/* <SmartListPagination /> */}
        </div>
      </div>
    </main>
  );
}
