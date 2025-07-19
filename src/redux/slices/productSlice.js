import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    tags: [],
    sizes: [],
    designTypes: [],
    designValues: [],
    variantTypes: [],
    variantValues: [],
  },
  sortOrder: "desc",
  sortBy: "popularity",
  searchQuery: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setFilters, setSortOrder, setSortBy, setSearchQuery } =
  productsSlice.actions;
export default productsSlice.reducer;
