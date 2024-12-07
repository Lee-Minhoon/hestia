"use client";

import { useForm } from "react-hook-form";

import { useSearchParams } from "@/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const rowsPerPage = [10, 20, 50, 100];

const TableControls = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  const form = useForm<{ search: string }>();

  return (
    <div className="flex gap-4">
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit((data) => {
          setSearchParams((searchParams) => {
            searchParams.set(QueryParamKeys.Search, data.search);
            return searchParams;
          });
        })}
      >
        <Input {...form.register("search")} placeholder="Search..." />
        <Button>Search</Button>
      </form>
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
    </div>
  );
};

export { TableControls };
