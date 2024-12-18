"use client";

import { useSearchParams } from "@/lib/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { SearchForm } from "./search-form";
import { ViewTypeSelector } from "./view-type-selector";

const rowsPerPage = [10, 20, 50, 100];

const TableControls = () => {
  const { setSearchParams } = useSearchParams();

  return (
    <div className="flex gap-4">
      <SearchForm
        onSubmit={(data) => {
          setSearchParams((searchParams) => {
            searchParams.set(QueryParamKeys.Search, data.search);
            return searchParams;
          });
        }}
      />
      <PageSizeSelector />
      <ViewTypeSelector />
    </div>
  );
};

const PageSizeSelector = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  return (
    <Select
      value={searchParams.get(QueryParamKeys.PageSize) ?? ""}
      onValueChange={(value) =>
        setSearchParams((searchParams) => {
          searchParams.set(QueryParamKeys.PageSize, value);
          return searchParams;
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Rows per page" />
      </SelectTrigger>
      <SelectContent>
        {rowsPerPage.map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { TableControls };
