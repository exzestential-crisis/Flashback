"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface NotificationItem {
  id: string | number;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
  removeNotification: (id: string | number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    const id = Date.now() + Math.random(); // Ensure unique ID
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
