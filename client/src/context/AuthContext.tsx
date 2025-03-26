import axios, { Axios, AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = {
  email: string;
  role: string;
  sessionHash: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (data: User) => void;
  apiClient: Axios;
  logoutHandler: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: { email: "", role: "", sessionHash: "" },
  login: () => {},
  apiClient: axios,
  logoutHandler: () => {},
});

const DEFAULT_USER = {
  email: "",
  role: "",
  sessionHash: "",
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(DEFAULT_USER);

  useEffect(() => {
    const __session = localStorage.getItem("__session");
    if (__session) {
      setUser(JSON.parse(__session));
      setIsAuthenticated(true);
    }
  }, []);

  const apiClient = useMemo(() => {
    const headers: RawAxiosRequestHeaders = {};
    if (user.sessionHash) {
      headers.Authorization = `Bearer ${user.sessionHash}`;
    }
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers,
    });
  }, [user.sessionHash]);

  const login = (data: User) => {
    setUser(data);
    setIsAuthenticated(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("__session");
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
    apiClient.get("/api/admin/logout").catch(console.log);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        apiClient,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
