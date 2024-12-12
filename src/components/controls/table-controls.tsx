"use client";

import { useForm } from "react-hook-form";
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
  return (
    <div className="flex gap-4">
      <SearchForm />
      <PageSizeSelector />
      <ViewTypeSelector />
    </div>
  );
};

const SearchForm = () => {
  const { setSearchParams } = useSearchParams();

  const form = useForm<{ search: string }>();

  return (
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

export { TableControls };
