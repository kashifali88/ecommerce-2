import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCartStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        addToCartSuccess: (state, action) => {
            const { product, quantity } = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.product_id === product._id);
            if (existingItemIndex >=0) {
                state.items[existingItemIndex].quantity += quantity;
            } else {
                state.items.push({ product_id: product._id, name: product.title, price: product.price, quantity });
            }
            state.totalQuantity += quantity;
            state.totalPrice += product.price * quantity;
            state.loading = false;
        },
        addToCartFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        removeFromCartStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        removeFromCartSuccess: (state, action) => {
            const productId = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.product._id === productId);
            if (existingItemIndex >=0){
                const item = state.items[existingItemIndex];
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(existingItemIndex, 1);
            }
            state.loading = false;
        },
        removeFromCartFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCartState: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.productId === productId);
            if(existingItemIndex >=0) {
                const item = state.items[existingItemIndex];
                state.totalQuantity += quantity - item.quantity;
                state.totalPrice += (quantity - item.quantity) * item.price;
                item.quantity = quantity;
            }
        state.loading = false;
        },
        updateCartFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCartItems: (state, action) => {
  state.items = action.payload;

  // 🔥 FIX: recalculate totals
  state.totalQuantity = action.payload.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  state.totalPrice = action.payload.reduce(
    (acc, item) =>
      acc + item.productId.price * item.quantity,
    0
  );
},

    }
})

export const { addToCartStart, addToCartSuccess, setCartItems, addToCartFailure, removeFromCartStart, removeFromCartSuccess, removeFromCartFailure, updateCartState, updateCartFailure } = cartSlice.actions;

export default cartSlice.reducer;