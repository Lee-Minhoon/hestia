"use client";

import { useCallback } from "react";

import { LayoutGridIcon, SearchIcon, TableIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useSearchParams } from "@/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function TableControls() {
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
}

function GridControls() {
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
}

interface SearchFormProps {
  onSubmit: (data: { [QueryParamKeys.Search]: string }) => void;
}

function SearchForm({ onSubmit }: SearchFormProps) {
  const t = useTranslations("Common");

  const form = useForm<{ [QueryParamKeys.Search]: string }>();

  return (
    <form
      className="flex gap-2"
      onSubmit={form.handleSubmit(useCallback(onSubmit, [onSubmit]))}
    >
      <Input
        {...form.register(QueryParamKeys.Search)}
        placeholder={t("searchPlaceholder")}
      />
      <Button type="submit">
        <SearchIcon />
        {t("search")}
      </Button>
    </form>
  );
}

const viewTypes = [
  {
    label: "tableView",
    icon: <TableIcon className="size-4" />,
    value: "table",
  },
  {
    label: "gridView",
    icon: <LayoutGridIcon className="size-4" />,
    value: "grid",
  },
] as const;

function ViewTypeSelector() {
  const t = useTranslations("Common");

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
            {icon}
            {t(label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const rowsPerPage = [10, 20, 50, 100];

function PageSizeSelector() {
  const t = useTranslations("Common");

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
        <SelectValue placeholder={t("rowsPerPage")} />
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
}

const orders = [
  {
    label: "descending",
    value: "desc",
  },
  {
    label: "ascending",
    value: "asc",
  },
] as const;

function OrderSelector() {
  const t = useTranslations("Common");

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
        <SelectValue placeholder={t("orderBy")} />
      </SelectTrigger>
      <SelectContent>
        {orders.map(({ label, value }) => (
          <SelectItem key={value} value={value.toString()}>
            {t(label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { GridControls, TableControls };
