"use client";

import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { addRecentSearch, clearRecentSearch, getRecentSearches } from "@/lib/helpers";
import { Button } from "../ui/button";

export default function SearchPopover() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<unknown[] | null>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    if (e.target.value.length > 0) {
      setSearchResult([{
        id: 1,
        title: "Course 1",
      }, {
        id: 2,
        title: "Course 2",
      }]);
    } else {
      setSearchResult(null);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addRecentSearch(e.currentTarget.value);
    }
  }

  return (
    <>
      <Dialog onOpenChange={() => setSearchResult(null)}>
        <DialogTrigger className="cursor-default">
          <div className="flex items-center gap-2 rounded-sm border border-border p-2">
            <Search className="size-4" />
            <span>Search courses, teachers...</span>
          </div>
        </DialogTrigger>
        <DialogContent className="border-none p-0 absolute bg-transparent"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search courses, teachers, etc...</DialogTitle>
          <section className="border-1.5 border-border rounded-md bg-background">
            <div className="p-3 lg:p-5 flex items-center gap-2 w-full">
              <Search className="size-4" />
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
                <>
                  {searchResult.map((item) => (
                    <div key={item.id}>{item.title}</div>
                  ))}
                </>
              ) : (
                recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <b className="font-medium">Recent</b>
                      <Button onClick={() => {
                        clearRecentSearch();
                        setRecentSearches([]);
                      }}>
                        Clear
                      </Button>
                    </div>
                    <div className="flex gap-2 lg:gap-4">
                      {recentSearches.map((search, index) => (
                        <Button key={index} variant="outline">
                          {search}
                        </Button>
                      ))}
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