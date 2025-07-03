"use client";

import { useCallback, useMemo } from "react";

import { LayoutGridIcon, SlidersHorizontalIcon, TableIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSearchParams } from "@/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function TableControls() {
  return (
    <>
      <div className="hidden sm:flex gap-4">
        <PageSizeSelector />
        <ViewTypeSelector />
      </div>
      <div className="sm:hidden">
        <TableControlMenu />
      </div>
    </>
  );
}

function GridControls() {
  return (
    <>
      <div className="hidden sm:flex gap-4">
        <OrderSelector />
        <ViewTypeSelector />
      </div>
      <div className="sm:hidden">
        <GridControlMenu />
      </div>
    </>
  );
}

function ViewTypeSelector() {
  const t = useTranslations("Common");

  const { viewType, onViewTypeChange } = useViewType();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {viewType.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewTypes.map(({ label, icon, value }) => (
          <DropdownMenuItem key={value} onClick={() => onViewTypeChange(value)}>
            {icon}
            {t(label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PageSizeSelector() {
  const t = useTranslations("Common");

  const { pageSize, onPageSizeChange } = usePageSize();

  return (
    <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("rowsPerPage")} />
      </SelectTrigger>
      <SelectContent>
        {rowsPerPage.map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {t("rows", { count: value })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function OrderSelector() {
  const t = useTranslations("Common");

  const { order, onOrderChange } = useOrder();

  return (
    <Select value={order.value} onValueChange={onOrderChange}>
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

function TableControlMenu() {
  const t = useTranslations("Common");

  const { viewType, onViewTypeChange } = useViewType();
  const { pageSize, onPageSizeChange } = usePageSize();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={viewType.value}
          onValueChange={onViewTypeChange}
        >
          {viewTypes.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {t(label)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={pageSize.toString()}
          onValueChange={onPageSizeChange}
        >
          {rowsPerPage.map((value) => (
            <DropdownMenuRadioItem key={value} value={value.toString()}>
              {t("rows", { count: value })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GridControlMenu() {
  const t = useTranslations("Common");

  const { viewType, onViewTypeChange } = useViewType();
  const { order, onOrderChange } = useOrder();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={viewType.value}
          onValueChange={onViewTypeChange}
        >
          {viewTypes.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {t(label)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={order.value}
          onValueChange={onOrderChange}
        >
          {orders.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {t(label)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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

function useViewType() {
  const { searchParams, setSearchParams } = useSearchParams();

  const viewType = useMemo(() => {
    const value = searchParams.get(QueryParamKeys.ViewType);
    return (
      viewTypes.find((viewType) => viewType.value === value) ?? viewTypes[0]
    );
  }, [searchParams]);

  const onViewTypeChange = useCallback(
    (newValue: string) => {
      if (newValue === viewType.value) {
        return;
      }

      const searchParams = new URLSearchParams();
      searchParams.set(QueryParamKeys.ViewType, newValue);
      setSearchParams(searchParams);
    },
    [setSearchParams, viewType]
  );

  return { viewType, onViewTypeChange };
}

const rowsPerPage = [10, 20, 50, 100];

function usePageSize() {
  const { searchParams, setSearchParams } = useSearchParams();

  const pageSize = useMemo(() => {
    const value = searchParams.get(QueryParamKeys.PageSize);
    return (
      rowsPerPage.find((row) => row.toString() === value) ?? rowsPerPage[0]
    );
  }, [searchParams]);

  const onPageSizeChange = useCallback(
    (newValue: string) => {
      setSearchParams((searchParams) => {
        searchParams.set(QueryParamKeys.PageSize, newValue);
        return searchParams;
      });
    },
    [setSearchParams]
  );

  return { pageSize, onPageSizeChange };
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

function useOrder() {
  const { searchParams, setSearchParams } = useSearchParams();

  const order = useMemo(() => {
    const value = searchParams.get(QueryParamKeys.Order);
    return orders.find((order) => order.value === value) ?? orders[0];
  }, [searchParams]);

  const onOrderChange = useCallback(
    (newValue: string) => {
      setSearchParams((searchParams) => {
        searchParams.set(QueryParamKeys.Order, newValue);
        return searchParams;
      });
    },
    [setSearchParams]
  );

  return { order, onOrderChange };
}

export { GridControls, TableControls };
