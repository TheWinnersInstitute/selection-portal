import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLoading } from "@/hooks/use-loading";
import { Trash2 } from "lucide-react";

const ExamCategoryRow = ({
  category,
  setSelectedRow,
  examName,
}: ExamCategoryRowProps) => {
  const deletingCategory = useLoading();
  const { apiClient } = useAuth();
  const { setExams } = useData();

  const deleteCategoryHandler = () => {
    deletingCategory.asyncWrapper(async () => {
      await apiClient.delete(`/api/exam/category/${category.id}`);
      setExams((prev) =>
        prev.map((prevExam) => {
          if (prevExam.id === category.examId)
            return {
              ...prevExam,
              examCategories: prevExam.examCategories.filter(
                (cat) => cat.id !== category.id
              ),
            };
          return prevExam;
        })
      );
      setSelectedRow((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          examCategories: prev.examCategories.filter(
            (cat) => cat.id !== category.id
          ),
        };
      });
    });
  };

  return (
    <TableRow key={category.id}>
      <TableCell>{category.name}</TableCell>
      <TableCell>{examName}</TableCell>
      <TableCell>
        <Button onClick={deleteCategoryHandler} type="button" size="icon">
          {deletingCategory.loader || <Trash2 className="text-red-400" />}
        </Button>
      </TableCell>
    </TableRow>
  );
};

type ExamCategoryRowProps = {
  category: ExamCategory;
  examName: string;
  setSelectedRow: React.Dispatch<React.SetStateAction<Exam | null>>;
};

export default ExamCategoryRow;
