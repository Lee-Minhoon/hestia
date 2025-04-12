"use client";

import { useCallback } from "react";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useSearchParams } from "@/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

function SearchForm() {
  const t = useTranslations("Common");

  const { setSearchParams } = useSearchParams();

  const form = useForm<{ [QueryParamKeys.Search]: string }>({
    defaultValues: {
      [QueryParamKeys.Search]: "",
    },
  });

  const handleSubmit = useCallback(
    (data: { [QueryParamKeys.Search]: string }) => {
      setSearchParams((searchParams) => {
        searchParams.set(QueryParamKeys.Search, data.search);
        return searchParams;
      });
    },
    [setSearchParams]
  );

  return (
    <Form {...form}>
      <form className="flex gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name={QueryParamKeys.Search}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("searchPlaceholder")} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
          <SearchIcon />
          {t("search")}
        </Button>
      </form>
    </Form>
  );
}

export { SearchForm };
