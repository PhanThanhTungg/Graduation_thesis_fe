import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllCourseFromWishList } from "@/service/wishlist.service";
import { CourseType } from "@/schema/course.schema";
import type { RootState } from "@/store/store";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface WishlistState {
  items: CourseType[];
  status: Status;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchWishlistCourses = createAsyncThunk<
  CourseType[],
  void,
  { rejectValue: string }
>("wishlist/fetchAll", async () => {
  const courses = await getAllCourseFromWishList();
  return courses;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    setWishlistItems(state, action: PayloadAction<CourseType[]>) {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    removeWishlistItemById(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.id.toString() !== action.payload,
      );
    },
    addWishlistItem(state, action: PayloadAction<CourseType>) {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlistCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlistCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Failed to load wishlist";
      });
  },
});

export const {
  clearWishlist,
  setWishlistItems,
  removeWishlistItemById,
  addWishlistItem,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

export const selectWishlistItems = (state: RootState) =>
  state.wishlist.items as CourseType[];
export const selectWishlistStatus = (state: RootState) =>
  state.wishlist.status as Status;
export const selectWishlistError = (state: RootState) =>
  state.wishlist.error as string | null;

export default wishlistReducer;
