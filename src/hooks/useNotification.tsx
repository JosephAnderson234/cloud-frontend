import { NotificationContext } from "@contexts/contexts";
import { useContext } from "react";

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification debe usarse dentro de NotificationProvider");
    return ctx;
};