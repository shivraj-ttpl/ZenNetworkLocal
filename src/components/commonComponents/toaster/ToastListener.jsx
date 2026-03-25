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

function ToastContent({ title, message }) {
  if (!message) {
    return <div className="toast-content__title">{title}</div>;
  }
  return (
    <div>
      <div className="toast-content__title">{title}</div>
      <div className="toast-content__message">{message}</div>
    </div>
  );
}

/**
 * Bridges Redux notification state → react-toastify.
 * Drop this component once inside <App /> alongside <ToastContainer />.
 *
 * Notification payload: { message, variant, description? }
 *   - message:     title text (bold)
 *   - description: optional body text below the title
 *   - variant:     TOASTER_VARIANT value
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
      show(
        <ToastContent
          title={notification.message}
          message={notification.description}
        />,
        {
          onClose: () => {
            dispatch(removeNotification(notification.id));
            shownIds.current.delete(notification.id);
          },
        }
      );
    });
  }, [notifications, dispatch]);

  return null;
};

export default ToastListener;
