import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import App from "./App.jsx";
import "./index.css";
import { SocketProvider } from "./store/context/SocketContext";
import { VideoCallProvider } from "./store/context/VideoCallContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <VideoCallProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </VideoCallProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>,
);
