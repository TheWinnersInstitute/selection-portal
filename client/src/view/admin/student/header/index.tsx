import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import StudentForm, { StudentFormValues } from "./student-form";
import jsPDF from "jspdf";
import { useData } from "@/context/DataContext";
import { getBase64Image, studentPdf } from "@/lib/utils";
import { toast } from "sonner";
import BulkUpload from "./bulk-upload";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  showAddBoardForm: boolean;
  toggleAddBoardForm: () => void;
  editData: Student | null;
  setEditData: React.Dispatch<React.SetStateAction<Student | null>>;
  form: UseFormReturn<StudentFormValues, any, undefined>;
  setSelectedExamId: React.Dispatch<React.SetStateAction<string | null>>;
  triggerRefetchStudents: () => void;
  searchHandler: (key: string, value: string) => void;
  studentsToDelete: BooleanMap;
};

export default function Header({
  showAddBoardForm,
  form,
  editData,
  setEditData,
  toggleAddBoardForm,
  setSelectedExamId,
  triggerRefetchStudents,
  searchHandler,
  studentsToDelete,
}: Props) {
  const { exams } = useData();

  return (
    <div className="flex justify-between items-center gap-3 pt-3 mb-3">
      <Input
        placeholder="Search..."
        onChange={(e) => searchHandler("q", e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Select
          onValueChange={(value) => {
            console.log({ value });
            if (value === "all") setSelectedExamId(null);
            else setSelectedExamId(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Exams</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {exams.map((exam) => {
                return (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search..."
          onChange={(e) => searchHandler("year", e.target.value)}
        />
        <BulkUpload
          studentsToDelete={studentsToDelete}
          triggerRefetchStudents={triggerRefetchStudents}
        />
        <Dialog open={showAddBoardForm} onOpenChange={toggleAddBoardForm}>
          <Button
            onClick={() => {
              form.reset();
              setEditData(null);
              toggleAddBoardForm();
            }}
            variant="outline"
          >
            Add Student
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create student form</DialogTitle>
            </DialogHeader>
            <StudentForm
              editData={editData}
              form={form}
              toggleAddBoardForm={toggleAddBoardForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
