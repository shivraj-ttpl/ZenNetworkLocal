import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";

const variantToToastFn = {
  [TOASTER_VARIANT.SUCCESS]: toast.success,
  [TOASTER_VARIANT.ERROR]: toast.error,
  [TOASTER_VARIANT.WARNING]: toast.warn,
  [TOASTER_VARIANT.INFO]: toast.info,
};

/**
 * Bridges Redux notification state → react-toastify.
 * Drop this component once inside <App /> alongside <ToastContainer />.
 */
const ToastListener = () => {
  const notifications = useSelector((state) => state.notification.list);
  const dispatch = useDispatch();
  const shownIds = useRef(new Set());

  useEffect(() => {
    notifications.forEach((notification) => {
      if (shownIds.current.has(notification.id)) return;

      shownIds.current.add(notification.id);

      const show = variantToToastFn[notification.variant] || toast;
      show(notification.message, {
        onClose: () => {
          dispatch(removeNotification(notification.id));
          shownIds.current.delete(notification.id);
        },
      });
    });
  }, [notifications, dispatch]);

  return null;
};

export default ToastListener;
