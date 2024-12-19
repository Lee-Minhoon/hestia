"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchFormProps {
  onSubmit: (data: { search: string }) => void;
}

const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const form = useForm<{ search: string }>();

  return (
    <form
      className="flex gap-2"
      onSubmit={form.handleSubmit(useCallback(onSubmit, [onSubmit]))}
    >
      <Input {...form.register("search")} placeholder="Search..." />
      <Button>Search</Button>
    </form>
  );
};

export { SearchForm };
