import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components/commonComponents/toaster/toastStyles.css";
import store from "@/core/store/store";
import AppRouter from "@/routes/AppRouter";
import ToastListener from "@/components/commonComponents/toaster/ToastListener";

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
      />
      <ToastListener />
    </Provider>
  );
}
