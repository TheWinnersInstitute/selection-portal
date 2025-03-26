import { Request, Response } from "express";
import { createReadStream } from "fs";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";
import { errorResponse, prisma } from "../../lib";
import { studentInclude } from ".";

export async function downloadStudentsExcel(req: Request, res: Response) {
  try {
    const students = await prisma.student.findMany({
      include: studentInclude,
    });
    const jsonData = students.flatMap((student) => {
      const studentData = {
        Name: student.name,
        MobileNumber: student.contactNumber.toString(),
        Photo: student.image?.path || "",
      };
      return student.Enrollment.map((enrollment) => {
        return {
          ...studentData,
          "EXAM Name": enrollment.exam.name,
          POST: enrollment.post,
          "Roll Number": enrollment.rollNumber.toString(),
          Result: enrollment.result?.path || "",
        };
      });
    });
    if (jsonData.length === 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json({
        message: "No error data available",
      });
      return;
    }
    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Errored Data");

    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students-data.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(excelBuffer);
  } catch (error) {
    errorResponse(res, error);
  }
}
