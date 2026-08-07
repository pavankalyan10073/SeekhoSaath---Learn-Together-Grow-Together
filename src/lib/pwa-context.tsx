import { createContext, useContext } from "react";

type PWAContextType = {
  canInstall: boolean;
  triggerInstall: () => Promise<void>;
};

export const PWAContext = createContext<PWAContextType>({
  canInstall: false,
  triggerInstall: async () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}
