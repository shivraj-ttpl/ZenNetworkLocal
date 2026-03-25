import store from "@/core/store/store";
import { addNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";

/**
 * Fire a toast from anywhere — components, event handlers, utils, outside React.
 *
 * Usage:
 *   showToast("Saved successfully", TOASTER_VARIANT.SUCCESS);
 *   showToast("Something went wrong");                      // defaults to ERROR
 *   showToast("Upload complete", TOASTER_VARIANT.SUCCESS, "3 files processed");
 */
export const showToast = (
  message,
  variant = TOASTER_VARIANT.ERROR,
  description
) => {
  store.dispatch(addNotification({ message, variant, description }));
};
