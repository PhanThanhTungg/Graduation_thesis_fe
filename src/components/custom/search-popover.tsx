"use client";

import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { getRecentSearches } from "@/lib/helpers";
import { Button } from "../ui/button";

export default function SearchPopover() {
  const [recentSearches] = useState<string[]>(() => getRecentSearches());
  const [searchResult, setSearchResult] = useState<unknown[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") console.log(e.currentTarget.value)
  }

  return (
    <>
      <Dialog>
        <DialogTrigger className="cursor-default">
          <div className="flex items-center gap-2 rounded-sm border border-border p-2">
            <Search className="size-4"/>
            <span>Search courses, teachers...</span>
          </div>
        </DialogTrigger>
        <DialogContent className="border-none p-0 absolute bg-transparent"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search courses, teachers, etc...</DialogTitle>
          <section className="border-1.5 border-border rounded-md bg-background">
            <div className="p-3 lg:p-5 flex items-center gap-2 w-full">
              <Search className="size-4"/>
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <hr />
            <div className="p-3 lg:p-5">
              {searchResult ? (
                <>abcd</>
              ) : (
                recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <b className="font-medium">Recent</b>
                      <Button>Clear</Button>
                    </div>
                  </>
                )
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}