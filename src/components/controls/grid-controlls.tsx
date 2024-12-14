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

const orders = ["asc", "desc"];

const GridControls = () => {
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
      <OrderSelector />
      <ViewTypeSelector />
    </div>
  );
};

const OrderSelector = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  return (
    <Select
      value={searchParams.get(QueryParamKeys.Order) ?? ""}
      onValueChange={(value) =>
        setSearchParams((searchParams) => {
          searchParams.set(QueryParamKeys.Order, value);
          return searchParams;
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Order" />
      </SelectTrigger>
      <SelectContent>
        {orders.map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { GridControls };
