"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentFormSchema } from "./header/student-form";
import StudentTable from "./student-table";

import Header from "./header";
import { useLoading } from "@/hooks/use-loading";

// export const STUDENTS_PER_PAGE = 5;

export default function AdminStudentsPage() {
  const searchTimeout = useRef<NodeJS.Timeout>(null);

  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const [editData, setEditData] = useState<null | Student>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(-1);
  const [studentsPerPage, setStudentsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const { apiClient, isAuthenticated } = useAuth();
  const { setStudents, students } = useData();

  const fetchingStudents = useLoading();

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      email: "",
      city: "",
      name: "",
      contactNumber: "",
      fatherName: "",
      // postAllotment: "",
      state: "Madhya Pradesh",
    },
  });

  const fetchStudents = async (
    skip: number,
    examId: string | null,
    q?: string
  ) => {
    if (fetchingStudents.loading) return;
    try {
      const { data } = await apiClient.get("/api/student", {
        params: {
          ...(examId ? { examId } : {}),
          ...(q ? { q } : {}),
          skip,
          take: studentsPerPage,
        },
      });
      if (skip === 0) setStudents(data.data);
      else setStudents((prev) => [...prev, ...data.data]);
      setTotal(data.total);
    } catch (error) {
      if (error instanceof AxiosError)
        toast(error.response?.data?.message || "Something went wrong");
    }
  };

  const triggerRefetchStudents = () => {
    setStudents([]);
    setCurrentPage(1);
    setTotal(-1);
  };

  useEffect(() => {
    triggerRefetchStudents();
  }, [selectedExamId, search]);

  useEffect(() => {
    if (
      students.length < currentPage * studentsPerPage &&
      students.length !== total &&
      isAuthenticated
    ) {
      fetchingStudents.asyncWrapper(() =>
        fetchStudents(students.length, selectedExamId, search)
      );
    }
  }, [currentPage, total, studentsPerPage, isAuthenticated]);

  const searchHandler = (q: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(q);
    }, 500);
  };

  const toggleAddBoardForm = () => setShowAddBoardForm((prev) => !prev);

  return (
    <div>
      <Header
        triggerRefetchStudents={triggerRefetchStudents}
        form={form}
        setEditData={setEditData}
        toggleAddBoardForm={toggleAddBoardForm}
        editData={editData}
        showAddBoardForm={showAddBoardForm}
        setSelectedExamId={setSelectedExamId}
        searchHandler={searchHandler}
      />
      <StudentTable
        editHandler={(student) => {
          setEditData(student);
          form.setValue("name", student.name);
          form.setValue("city", student.city || "");
          form.setValue("contactNumber", student.contactNumber || "");

          if (student.dateOfBirth) {
            const dob = new Date(student.dateOfBirth);
            form.setValue("year", dob.getFullYear().toString());
            form.setValue("date", dob.getDate().toString());
            form.setValue("month", (dob.getMonth() + 1).toString());
          }
          form.setValue("email", student.email || "");
          form.setValue("fatherName", student.fatherName || "");
          form.setValue("state", student.state || "");
          toggleAddBoardForm();
        }}
        loader={fetchingStudents.loader}
        total={total}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        studentsPerPage={studentsPerPage}
        setStudentsPerPage={setStudentsPerPage}
      />
    </div>
  );
}
