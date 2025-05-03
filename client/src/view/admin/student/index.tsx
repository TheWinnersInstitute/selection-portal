"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentFormSchema } from "./header/student-form";
import StudentTable from "./student-table";

import Header from "./header";
import { useLoading } from "@/hooks/use-loading";

export type StudentSearch = { [key: string]: string };

export default function AdminStudentsPage() {
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const [editData, setEditData] = useState<null | Student>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(-1);
  const [studentsPerPage, setStudentsPerPage] = useState(25);
  const [search, setSearch] = useState<StudentSearch>({});
  const [studentsToDelete, setStudentsToDelete] = useState<BooleanMap>({});

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
      state: "Madhya Pradesh",
    },
  });

  const fetchStudents = async (skip: number, search?: StudentSearch) => {
    console.log("Trying to fetch Students");
    if (fetchingStudents.loading) return;
    console.log("Fetching Students");
    try {
      const { data } = await apiClient.get("/api/student", {
        params: {
          ...search,
          skip,
          take: studentsPerPage,
        },
      });
      console.log({ data: data.data });
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
    return () => {
      triggerRefetchStudents();
    };
  }, [search]);

  useEffect(() => {
    if (
      students.length < currentPage * studentsPerPage &&
      students.length !== total &&
      isAuthenticated
    ) {
      fetchingStudents.asyncWrapper(() =>
        fetchStudents(students.length, search)
      );
    }
  }, [currentPage, total, studentsPerPage, isAuthenticated]);

  const toggleAddBoardForm = () => setShowAddBoardForm((prev) => !prev);

  if (fetchingStudents.unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="font-bold opacity-55">
          You are not authorized to access this screen
        </h2>
      </div>
    );
  }

  console.log({ students });
  return (
    <div>
      <Header
        studentsToDelete={studentsToDelete}
        triggerRefetchStudents={triggerRefetchStudents}
        form={form}
        setEditData={setEditData}
        toggleAddBoardForm={toggleAddBoardForm}
        editData={editData}
        showAddBoardForm={showAddBoardForm}
        // setSelectedExamId={setSelectedExamId}
        search={search}
        setSearch={setSearch}
      />
      <StudentTable
        studentsToDelete={studentsToDelete}
        setStudentsToDelete={setStudentsToDelete}
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
