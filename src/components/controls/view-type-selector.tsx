"use client";

import { CiGrid41, CiViewTable } from "react-icons/ci";

import { useSearchParams } from "@/lib/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const viewTypes = [
  {
    label: "Table View",
    icon: <CiViewTable className="w-4 h-4" />,
    value: "table",
  },
  {
    label: "Grid View",
    icon: <CiGrid41 className="w-4 h-4" />,
    value: "grid",
  },
];

const ViewTypeSelector = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {viewTypes.find(
            (viewType) =>
              viewType.value === searchParams.get(QueryParamKeys.ViewType)
          )?.icon ?? viewTypes[0].icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewTypes.map(({ label, icon, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => {
              const searchParams = new URLSearchParams();
              searchParams.set(QueryParamKeys.ViewType, value);
              setSearchParams(searchParams);
            }}
          >
            <div className="flex gap-2 items-center">
              {icon}
              {label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ViewTypeSelector };
