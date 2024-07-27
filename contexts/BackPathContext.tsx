import { createContext, useContext } from "react";

export const BackPathContext = createContext<any>(null);

export const useBackPath = () => useContext(BackPathContext);
