import React, { createContext, useContext } from "react";

interface UserContextType {
  name: string | null | undefined;
  image: string | null | undefined;
  email: string | null | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserContextType;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
