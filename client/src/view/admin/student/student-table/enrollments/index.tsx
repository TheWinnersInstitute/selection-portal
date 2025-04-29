import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnrollmentsList from "./enrollments-list";
import { Button } from "@/components/ui/button";
import EnrollmentForm from "./form";

type Props = {
  showViewStudentModel: boolean;
  toggleViewStudent: () => void;
  currentStudent: Student | null;
  setCurrentStudent: (data: Student | null) => void;
};

export default function Enrollments({
  showViewStudentModel,
  toggleViewStudent,
  currentStudent,
  setCurrentStudent,
}: Props) {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const toggleEnrollmentForm = () => setShowEnrollmentForm((prev) => !prev);

  return (
    <Dialog open={showViewStudentModel} onOpenChange={toggleViewStudent}>
      <DialogContent className="lg:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>
            {showEnrollmentForm && "Add "} {currentStudent?.name} selections
          </DialogTitle>
        </DialogHeader>
        {!showEnrollmentForm && currentStudent && (
          <>
            <EnrollmentsList
              showDetails
              student={currentStudent}
              setCurrentStudent={setCurrentStudent}
            />
            <Button onClick={toggleEnrollmentForm}>Add Selection</Button>
          </>
        )}
        {showEnrollmentForm && currentStudent && (
          <EnrollmentForm
            studentId={currentStudent.id}
            toggleEnrollmentForm={toggleEnrollmentForm}
            setCurrentStudent={setCurrentStudent}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
