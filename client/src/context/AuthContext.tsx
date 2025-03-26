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
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: { email: "", role: "", sessionHash: "" },
  login: () => {},
  apiClient: axios,
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    email: "",
    role: "",
    sessionHash: "",
  });

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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        apiClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
