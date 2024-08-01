import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface SettingsContextType {
  isDashboardTutorialShown: boolean;
  setIsDashboardTutorialShown: Dispatch<SetStateAction<boolean>>;
  isContactsTutorialShown: boolean;
  setIsContactsTutorialShown: Dispatch<SetStateAction<boolean>>;
  isProfileTutorialShown: boolean;
  setIsProfileTutorialShown: Dispatch<SetStateAction<boolean>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDashboardTutorialShown, setIsDashboardTutorialShown] =
    useState(true);

  const [isContactsTutorialShown, setIsContactsTutorialShown] = useState(true);

  const [isProfileTutorialShown, setIsProfileTutorialShown] = useState(true);
  return (
    <SettingsContext.Provider
      value={{
        isDashboardTutorialShown,
        setIsDashboardTutorialShown,
        isContactsTutorialShown,
        setIsContactsTutorialShown,
        isProfileTutorialShown,
        setIsProfileTutorialShown,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
