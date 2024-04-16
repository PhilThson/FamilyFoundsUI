import classes from "./Notification.module.css";
import { createPortal } from "react-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { uiSliceActions } from "../../store/ui-slice";
import { useEffect } from "react";
import { INotification } from "../../models/Main";

const Notification: React.FC<INotification> = (notification) => {
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

  let notificationTitle = notification.title;
  if (notificationTitle === undefined) {
    switch (notification.status) {
      case "idle":
        notificationTitle = "Brak";
        break;
      case "error":
        notificationTitle = "Błąd";
        break;
      case "pending":
        notificationTitle = "Ładowanie";
        break;
      case "success":
        notificationTitle = "Sukces";
        break;
    }
  }

  let specialClasses = "";

  if (notification.status === "error") {
    specialClasses = classes.error;
  } else if (notification.status === "success") {
    specialClasses = classes.success;
  } else {
    specialClasses = classes.info;
  }

  const cssClasses = `${classes.notification} ${specialClasses}`;

  const notifactionContent = (
    <section className={cssClasses} onClick={handleNotificationClose}>
      <h2>{notificationTitle}</h2>
      <p>{notification.message}</p>
    </section>
  );

  return (
    <>
      {createPortal(
        notifactionContent,
        document.getElementById("notification-root") as Element
      )}
    </>
  );
};

export default Notification;
