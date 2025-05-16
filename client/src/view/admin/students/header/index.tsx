import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";
import StudentForm, { StudentFormValues } from "./student-form";
import BulkUpload from "./bulk-upload";
import { UseFormReturn } from "react-hook-form";

import StudentFilter from "./filter";
import { StudentSearch } from "..";

export default function Header({
  showAddBoardForm,
  form,
  editData,
  setEditData,
  toggleAddBoardForm,
  triggerRefetchStudents,
  setSearch,
  studentsToDelete,
  search,
}: Props) {
  return (
    <div className="flex justify-between items-center gap-3 pt-3 mb-3">
      <div></div>
      <div className="flex items-center gap-3">
        <StudentFilter search={search} setSearch={setSearch} />
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

type Props = {
  showAddBoardForm: boolean;
  toggleAddBoardForm: () => void;
  editData: Student | null;
  setEditData: React.Dispatch<React.SetStateAction<Student | null>>;
  form: UseFormReturn<StudentFormValues, any, undefined>;
  triggerRefetchStudents: () => void;
  setSearch: React.Dispatch<React.SetStateAction<StudentSearch>>;
  studentsToDelete: BooleanMap;
  search: StudentSearch;
};
