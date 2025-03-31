import React from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EnrollmentRow from "./enrollment-row";
import { useData } from "@/context/DataContext";

type Props = {
  student: Student;
  setCurrentStudent: (data: Student | null) => void;
};

export default function EnrollmentsList({ student, setCurrentStudent }: Props) {
  const { setStudents } = useData();
  return (
    <div>
      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead>S.No.</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Exam</TableHead>
            <TableHead>Roll number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {student.Enrollment?.map((enrollment, index) => {
            return (
              <EnrollmentRow
                enrollment={enrollment}
                index={index}
                key={enrollment.id}
                onDelete={() => {
                  const updatedEnrollment =
                    student.Enrollment?.filter((enroll) => {
                      return enroll.id !== enrollment.id;
                    }) || [];
                  const updatedStudent = {
                    ...student,
                    Enrollment: updatedEnrollment,
                  };
                  setStudents((prev) =>
                    prev.map((_student) => {
                      if (student.id === _student.id) {
                        return updatedStudent;
                      }
                      return _student;
                    })
                  );
                  setCurrentStudent(updatedStudent);
                }}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
