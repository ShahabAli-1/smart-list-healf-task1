import { ITEM_HEIGHT } from "@/constants";
import { YelpItem } from "@/types";
import React from "react";

type SmartListItemProps = {
  item: YelpItem;
};

const SmartListItem = ({ item }: SmartListItemProps) => {
  return (
    <li
      key={item.ID}
      className="w-full bg-white px-4 py-2 flex flex-col justify-center border border-gray-400 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-95"
      style={{ height: `${ITEM_HEIGHT - 24}px` }}
    >
      <h2 className="text-2xl font-bold text-gray-800 truncate">
        {item.Organization}
      </h2>
      <p className="text-sm text-gray-600 mt-1">Rating: {item.Rating}</p>
    </li>
  );
};

export default SmartListItem;
