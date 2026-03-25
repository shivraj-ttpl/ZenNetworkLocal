import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components/commonComponents/toaster/toastStyles.css";
import store from "@/core/store/store";
import ToastListener from "@/components/commonComponents/toaster/ToastListener";
import MainApp from "./app/MainApp";

export default function App() {

  return (
    <Provider store={store}>
      <MainApp/>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
      />
      <ToastListener />
    </Provider>
  );
}
