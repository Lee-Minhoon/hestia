"use client";

import { useForm } from "react-hook-form";

import { useSearchParams } from "@/hooks/use-search-params";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const TableControls = () => {
  const { setSearchParams } = useSearchParams();

  const form = useForm<{ search: string }>();

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit((data) => {
          setSearchParams((searchParams) => {
            searchParams.set("search", data.search);
            return searchParams;
          });
        })}
      >
        <Input {...form.register("search")} />
        <Button>Search</Button>
      </form>
    </div>
  );
};

export { TableControls };
