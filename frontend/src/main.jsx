import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./redux/store/store.js";
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer position="top-right" autoClose={2000} />
      </PersistGate>
      </Provider>
    </BrowserRouter>
  </HelmetProvider>,
);


