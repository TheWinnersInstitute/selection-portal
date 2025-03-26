import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";

type DataContextType = {
  boards: Board[];
  exams: Exam[];
  students: Student[];
  setBoards: Dispatch<SetStateAction<Board[]>>;
  setExams: Dispatch<SetStateAction<Exam[]>>;
  setStudents: Dispatch<SetStateAction<Student[]>>;
};

const DataContext = createContext<DataContextType>({
  boards: [],
  exams: [],
  setBoards: () => {},
  setExams: () => {},
  setStudents: () => {},
  students: [],
});

export const DataContextProvider = ({ children }: PropsWithChildren) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { apiClient } = useAuth();

  useEffect(() => {
    if ([].length === 0) {
      (async () => {
        try {
          const { data } = await apiClient.get("/api/board");
          const examsResponse = await apiClient.get("/api/exam");
          setBoards(data.data);
          setExams(examsResponse.data.data);
        } catch (error) {
          if (error instanceof AxiosError)
            toast(error.response?.data?.message || "Something went wrong");
        }
      })();
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        boards,
        exams,
        setBoards,
        setExams,
        setStudents,
        students,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
