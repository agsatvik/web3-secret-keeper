import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Web3Auth } from "@web3auth/modal";
import { IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  isAuthenticated: boolean;
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  storeSecret: (key: string, value: string) => Promise<void>;
  getSecret: (key: string) => Promise<string | null>;
  getAllSecrets: () => Promise<Record<string, string>>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  storeSecret: async () => {},
  getSecret: async () => null,
  getAllSecrets: async () => ({}),
});

export const useWeb3Auth = () => useContext(Web3AuthContext);

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected && web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          setIsAuthenticated(true);
          const userInfo = await web3authInstance.getUserInfo();
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setIsAuthenticated(true);
      const userInfo = await web3auth.getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    
    try {
      await web3auth.logout();
      setProvider(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const storeSecret = async (key: string, value: string) => {
    try {
      const secrets = JSON.parse(localStorage.getItem("web3auth_secrets") || "{}");
      secrets[key] = value;
      localStorage.setItem("web3auth_secrets", JSON.stringify(secrets));
    } catch (error) {
      console.error("Error storing secret:", error);
      throw error;
    }
  };

  const getSecret = async (key: string): Promise<string | null> => {
    try {
      const secrets = JSON.parse(localStorage.getItem("web3auth_secrets") || "{}");
      return secrets[key] || null;
    } catch (error) {
      console.error("Error getting secret:", error);
      return null;
    }
  };

  const getAllSecrets = async (): Promise<Record<string, string>> => {
    try {
      return JSON.parse(localStorage.getItem("web3auth_secrets") || "{}");
    } catch (error) {
      console.error("Error getting all secrets:", error);
      return {};
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        provider,
        isAuthenticated,
        user,
        login,
        logout,
        storeSecret,
        getSecret,
        getAllSecrets,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};
