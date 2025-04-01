import { useData } from "@/context/DataContext";
import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StudentTableRow from "./table-row";
import Enrollments from "./enrollments";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  editHandler: (data: Student) => void;
  total: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  studentsPerPage: number;
  setStudentsPerPage: React.Dispatch<React.SetStateAction<number>>;
  loader: React.JSX.Element | null;
  setStudentsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function StudentTable({
  editHandler,
  currentPage,
  total,
  setCurrentPage,
  setStudentsPerPage,
  studentsPerPage,
  loader,
  setStudentsToDelete,
}: Props) {
  const [showViewStudentModel, setShowViewStudentModel] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<null | Student>(null);

  const { students } = useData();

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
      {students.length === 0 && !loader && (
        <p className="flex justify-center my-1">No data</p>
      )}
      {students.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{/* <Checkbox /> */}</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead className="text-center">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post</TableHead>
                      <TableHead className="text-center">Rank</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Roll number</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students
              .slice(startIndex, startIndex + studentsPerPage)
              .map((student, index) => {
                return (
                  <StudentTableRow
                    setStudentsToDelete={setStudentsToDelete}
                    key={student.id}
                    setCurrentStudent={setCurrentStudent}
                    editHandler={editHandler}
                    student={student}
                    onClick={() => {
                      setCurrentStudent(student);
                      toggleViewStudent();
                    }}
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
              <SelectValue placeholder="Students per page" />
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
      <Enrollments
        currentStudent={currentStudent}
        showViewStudentModel={showViewStudentModel}
        toggleViewStudent={toggleViewStudent}
        setCurrentStudent={setCurrentStudent}
      />
    </>
  );
}
