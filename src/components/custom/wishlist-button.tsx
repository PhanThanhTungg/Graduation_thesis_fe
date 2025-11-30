"use client";

import {
  addCourseToWishList,
  removeCourseFromWishList,
} from "@/service/wishlist.service";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWishlistItem,
  removeWishlistItemById,
} from "@/store/features/wishlistSlice";
import { RootState } from "@/store/store";
import { CourseType } from "@/schema/course.schema";

export default function WishlistButton({ course }: { course: CourseType }) {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();
  const coursesInWishlist = useSelector(
    (state: RootState) => state.wishlist.items,
  );

  useEffect(() => {
    const isCourseInWishlist = coursesInWishlist.some(
      (item) => item.id.toString() === course.id.toString(),
    );
    setIsInWishlist(isCourseInWishlist);
  }, [coursesInWishlist, course.id]);

  const addOrRemoveCourseToWishlist = async () => {
    setPending(true);
    const isSuccess = isInWishlist
      ? await removeCourseFromWishList(course.id.toString())
      : await addCourseToWishList(course.id.toString());
    setPending(false);
    if (isSuccess) {
      if (isInWishlist) {
        dispatch(removeWishlistItemById(course.id.toString()));
      } else {
        dispatch(addWishlistItem(course));
      }
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await addOrRemoveCourseToWishlist();
          }}
          className="absolute z-50 left-1/2 -translate-x-1/2 bg-background p-1 rounded-sm
                      opacity-0 group-hover:opacity-100 bottom-0 group-hover:bottom-2 transition-all duration-300"
          disabled={pending}
        >
          <Heart
            fill={
              isInWishlist ? "var(--color-green)" : "var(--color-secondary)"
            }
            color={
              isInWishlist
                ? "var(--color-green)"
                : "var(--color-secondary-foreground)"
            }
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
