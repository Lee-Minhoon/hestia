"use client";

import { useCallback } from "react";

import { useSearchParams } from "next/navigation";
import { MdDelete, MdEdit, MdOutlineArrowBack } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/routing";
import { QueryParamKeys } from "@/lib/queryParams";
import { buildUrl, Pages, toUrl } from "@/lib/routes";

interface ArticleActionsProps {
  isOwner: boolean;
}

export default function ArticleActions({ isOwner }: ArticleActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = useCallback(() => {
    router.push(
      searchParams.get(QueryParamKeys.Next) ?? buildUrl(toUrl(Pages.Posts))
    );
  }, [router, searchParams]);

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={handleBack}>
        <MdOutlineArrowBack />
        Back
      </Button>
      {isOwner && (
        <div className="flex gap-2">
          <Button variant="outline">
            <MdEdit />
            Edit
          </Button>
          <Button variant="outline">
            <MdDelete />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
