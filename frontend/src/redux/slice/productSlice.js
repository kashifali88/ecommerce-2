import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  productList: [],
};
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${API}/products/create-product`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);


export const fetchFilterProducts = createAsyncThunk(
  "/products/fetchFilterProducts",

  async ({ filters, sort }, thunkAPI) => {
    try {

      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        params.append(key, filters[key].join(","));
      });

      if (sort) {
        params.append("sortBy", sort);
      }

      const res = await fetch(
        `${API}/products/search?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }

      return data.products;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API}/products`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "/products/updateProduct",
  async ({ id, formData, thunkAPI }) => {
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // FETCH FILTER PRODUCTS
    .addCase(fetchFilterProducts.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchFilterProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.productList = action.payload;
    })
    .addCase(fetchFilterProducts.rejected, (state) => {
      state.loading = false;
      state.productList = [];
    })
      // FETCH ALL PRODUCTS
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
        state.productList = [];
      })
      // ADD PRODUCT (
      .addCase(addNewProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.loading = false;

        if (!Array.isArray(state.productList)) {
          state.productList = [];
        }
        state.productList.push(action.payload.newProduct);
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.productList = state.productList.map((product) =>
          product._id === action.payload.updatedProduct._id
            ? action.payload.updatedProduct
            : product,
        );
      })
      .addCase(updateProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.productList = state.productList.filter(
          (product) => product._id !== action.payload.deletedProduct._id,
        );
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productsSlice.reducer;
