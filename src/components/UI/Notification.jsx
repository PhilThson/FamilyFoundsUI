import classes from "./Notification.module.css";
import { createPortal } from "react-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { uiSliceActions } from "../../store/ui-slice";
import { useEffect } from "react";

const Notification = ({ notification }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(uiSliceActions.clearNotification());
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  const handleNotificationClose = () => {
    dispatch(uiSliceActions.clearNotification());
  };

  let specialClasses = "";

  if (notification.status === "error") {
    specialClasses = classes.error;
  }
  if (notification.status === "success") {
    specialClasses = classes.success;
  }

  const cssClasses = `${classes.notification} ${specialClasses}`;

  const notifactionContent = (
    <section className={cssClasses} onClick={handleNotificationClose}>
      <h2>{notification.title}</h2>
      <p>{notification.message}</p>
    </section>
  );

  return (
    <>
      {createPortal(
        notifactionContent,
        document.getElementById("notification-root")
      )}
    </>
  );
};

export default Notification;
