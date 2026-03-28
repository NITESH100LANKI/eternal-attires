import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'Stripe',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const updateCart = (state) => {
  // Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate shipping price (If order is over INR 5000 then free, else INR 500)
  const shippingPrice = itemsPrice > 5000 ? 0 : 50;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate tax price (15% tax)
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // Calculate total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
