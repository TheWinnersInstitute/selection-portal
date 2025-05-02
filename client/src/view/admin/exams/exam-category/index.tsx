import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLoading } from "@/hooks/use-loading";
import React, { useRef } from "react";
import { toast } from "sonner";
import ExamCategoryRow from "./row";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ExamCategory({ selectedRow, setSelectedRow }: Props) {
  const categoryInput = useRef<HTMLInputElement>(null);

  const { setExams } = useData();
  const { apiClient } = useAuth();
  const processingCategory = useLoading();

  const addCategoryHandler = () => {
    if (!selectedRow) return;
    processingCategory.asyncWrapper(async () => {
      if (!categoryInput.current) {
        toast("Please enter a category name");
        return;
      }
      const { data } = await apiClient.post("/api/exam/category", {
        name: categoryInput.current.value,
        examId: selectedRow.id,
      });
      setExams((prev) =>
        prev.map((prevExam) => {
          if (prevExam.id === selectedRow.id)
            return {
              ...prevExam,
              examCategories: [
                ...(prevExam?.examCategories || []),
                data.data[0],
              ],
            };
          return prevExam;
        })
      );
      setSelectedRow((prev) => ({
        ...(prev || ({} as Exam)),
        examCategories: [...(prev?.examCategories || []), data.data[0]],
      }));
      categoryInput.current.value = "";
    });
  };
  return (
    <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
      <DialogContent>
        <DialogTitle>Exam categories</DialogTitle>
        <div className="flex justify-between items-center gap-3 my-2">
          <Input
            ref={categoryInput}
            placeholder="Pre/Mains/Tear-1"
            className="flex-1"
          />
          <Button onClick={addCategoryHandler} type="button">
            {processingCategory.loader || "Add Category"}
          </Button>
        </div>
        <Table>
          {selectedRow?.examCategories.length === 0 && (
            <TableCaption>No data.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Exam name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRow?.examCategories.map((category) => {
              return (
                <ExamCategoryRow
                  key={category.id}
                  category={category}
                  examName={selectedRow.name}
                  setSelectedRow={setSelectedRow}
                />
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

type Props = {
  exam: Exam | null;
  setEditData: React.Dispatch<React.SetStateAction<Exam | null>>;
  selectedRow: Exam | null;
  setSelectedRow: React.Dispatch<React.SetStateAction<Exam | null>>;
};
