"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentFormSchema } from "./header/student-form";
import StudentTable from "./student-table";

import Header from "./header";

// export const STUDENTS_PER_PAGE = 5;

export default function AdminStudentsPage() {
  const { apiClient } = useAuth();
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const { setStudents, students } = useData();
  const [editData, setEditData] = useState<null | Student>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(-1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      email: "",
      city: "",
      name: "",
      contactNumber: "",
      dateOfBirth: new Date(),
      fatherName: "",
      // postAllotment: "",
      state: "Madhya Pradesh",
    },
  });

  const fetchStudents = async (skip: number, examId: string | null) => {
    try {
      const { data } = await apiClient.get("/api/student", {
        params: {
          ...(examId ? { examId } : {}),
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

  useEffect(() => {
    setStudents([]);
    setCurrentPage(1);
    setTotal(-1);
    // fetchStudents(0, selectedExamId);
  }, [selectedExamId]);

  useEffect(() => {
    console.log({
      "students.length": students.length,
      "currentPage * studentsPerPage": currentPage * studentsPerPage,
      total,
    });
    if (
      students.length < currentPage * studentsPerPage &&
      students.length !== total
    ) {
      fetchStudents(students.length, selectedExamId);
    }
  }, [currentPage, total, studentsPerPage, students.length]);

  const toggleAddBoardForm = () => setShowAddBoardForm((prev) => !prev);

  return (
    <div>
      <Header
        form={form}
        setEditData={setEditData}
        toggleAddBoardForm={toggleAddBoardForm}
        editData={editData}
        showAddBoardForm={showAddBoardForm}
        setSelectedExamId={setSelectedExamId}
      />
      <StudentTable
        editHandler={(student) => {
          setEditData(student);
          form.setValue("name", student.name);
          form.setValue("city", student.city || "");
          form.setValue("contactNumber", student.contactNumber || "");
          if (student.dateOfBirth) {
            form.setValue("dateOfBirth", new Date(student.dateOfBirth || ""));
          }
          form.setValue("email", student.email || "");
          form.setValue("fatherName", student.fatherName || "");
          form.setValue("state", student.state || "");
          toggleAddBoardForm();
        }}
        total={total}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        studentsPerPage={studentsPerPage}
        setStudentsPerPage={setStudentsPerPage}
      />
    </div>
  );
}
