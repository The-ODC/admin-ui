import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { ErrorBoundary } from "TheOdcMfUI/helpers";
import { ThemeProviderWrapper } from "TheOdcMfUI/theme";
import App from "./App.jsx";
import Store from "./store";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <StrictMode>
      <ErrorBoundary>
        <ThemeProviderWrapper>
          <BrowserRouter>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </BrowserRouter>
        </ThemeProviderWrapper>
      </ErrorBoundary>
    </StrictMode>
  </Provider>
);
