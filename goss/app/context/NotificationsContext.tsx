import React, { createContext, useContext } from 'react';
import useNotifications from '../hooks/useNotifications';

const NotificationsContext = createContext<
  ReturnType<typeof useNotifications> | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const notificationsData = useNotifications();

  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useGlobalNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalNotifications must be used within a NotificationsProvider'
    );
  }
  return context;
};
