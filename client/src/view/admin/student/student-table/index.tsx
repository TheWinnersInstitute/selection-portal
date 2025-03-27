import { useData } from "@/context/DataContext";
import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoading } from "@/hooks/use-loading";
import StudentTableRow from "./table-row";

type Props = {
  editHandler: (data: Student) => void;
  total: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  studentsPerPage: number;
  setStudentsPerPage: React.Dispatch<React.SetStateAction<number>>;
  loader: React.JSX.Element | null;
};

export default function StudentTable({
  editHandler,
  currentPage,
  total,
  setCurrentPage,
  setStudentsPerPage,
  studentsPerPage,
  loader,
}: Props) {
  const [showViewStudentModel, setShowViewStudentModel] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<null | Student>(null);

  const { students, setStudents } = useData();

  const totalPages = useMemo(() => {
    return (
      (total - (total % studentsPerPage)) / studentsPerPage +
      (total % studentsPerPage === 0 ? 0 : 1)
    );
  }, [total, studentsPerPage]);

  const startIndex = (currentPage - 1) * studentsPerPage;

  const toggleViewStudent = () => setShowViewStudentModel((prev) => !prev);

  return (
    <>
      {students.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Roll number</TableHead>
              {/* <TableHead>DOB</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students
              .slice(startIndex, startIndex + studentsPerPage)
              .map((student, index) => {
                return (
                  <StudentTableRow
                    key={student.id}
                    editHandler={editHandler}
                    index={studentsPerPage * (currentPage - 1) + index}
                    student={student}
                  />
                );
              })}
          </TableBody>
        </Table>
      )}
      {loader && (
        <div className="flex justify-center items-center my-4">{loader}</div>
      )}
      <Pagination className="mt-3">
        <PaginationContent className=" gap-3">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage !== 1) {
                  setCurrentPage((prev) => prev - 1);
                }
              }}
            />
          </PaginationItem>
          {currentPage !== 1 && (
            <PaginationItem
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
              }}
            >
              <PaginationLink href="#">{currentPage - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          {currentPage !== totalPages && (
            <PaginationItem
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
              }}
            >
              {currentPage + 1}
            </PaginationItem>
          )}
          <PaginationItem
            onClick={() => {
              if (currentPage !== totalPages) {
                setCurrentPage((prev) => prev + 1);
              }
            }}
          >
            <PaginationNext />
          </PaginationItem>
          <Select
            value={studentsPerPage.toString()}
            onValueChange={(v) => setStudentsPerPage(parseInt(v, 10))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Students per page"
                // defaultValue={studentsPerPage}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Students per page</SelectLabel>
                {[5, 10, 20, 25, 50, 100, 1000].map((num) => {
                  return (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </PaginationContent>
      </Pagination>

      <Dialog open={showViewStudentModel} onOpenChange={toggleViewStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStudent?.name}</DialogTitle>
          </DialogHeader>
          <div>
            <h3 className="font-semibold">Enrollments</h3>
            {currentStudent?.Enrollment?.map((enrollment) => {
              return (
                <div key={enrollment.id}>
                  <div className="flex justify-between items-center gap-1">
                    <p>Post: {enrollment.post}</p>
                    <p>Roll number: {enrollment.rollNumber}</p>
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <p>Exam: {enrollment.exam.name}</p>
                    {/* <p>Roll number: {enrollment.result.path}</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
