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
import { getBase64Image } from "@/lib/utils";
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

type Props = {
  showAddBoardForm: boolean;
  toggleAddBoardForm: () => void;
  editData: Student | null;
  setEditData: React.Dispatch<React.SetStateAction<Student | null>>;
  form: UseFormReturn<StudentFormValues, any, undefined>;
  setSelectedExamId: React.Dispatch<React.SetStateAction<string | null>>;
  triggerRefetchStudents: () => void;
};

export default function Header({
  showAddBoardForm,
  form,
  editData,
  setEditData,
  toggleAddBoardForm,
  setSelectedExamId,
  triggerRefetchStudents,
}: Props) {
  const { students, exams } = useData();

  // const downloadPfdHandler = async () => {
  //   const doc = new jsPDF();

  //   let index = 0;
  //   const imageWidth = 100;
  //   const imageHeight = 100;
  //   for (const student of students) {
  //     if (student.image) {
  //       try {
  //         const base64Img = await getBase64Image(
  //           student.image.path,
  //           student.image.type
  //         );
  //         if (typeof base64Img === "string") {
  //           console.log(base64Img);
  //           doc.addImage(
  //             base64Img,
  //             student.image.type.split("/")[1].toUpperCase(),
  //             10,
  //             30 + imageHeight * index,
  //             imageWidth,
  //             imageHeight
  //           );
  //         }
  //         index++;
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  //   if (index !== 0) {
  //     doc.save("students.pdf");
  //   } else {
  //     toast("No data to export");
  //   }
  // };
  return (
    <div className="flex justify-between items-center pt-3 mb-3">
      <h2>Students</h2>
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
        <BulkUpload triggerRefetchStudents={triggerRefetchStudents} />
        {/* <Button onClick={downloadPfdHandler}>Download pdf</Button> */}
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
