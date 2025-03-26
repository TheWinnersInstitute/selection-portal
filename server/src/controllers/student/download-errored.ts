import { Request, Response } from "express";
import { createReadStream } from "fs";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";
import { errorResponse } from "../../lib";

export async function downloadErroredData(req: Request, res: Response) {
  try {
    const filePath = path.join(__dirname, "../../../assets/errors.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (jsonData.students.length === 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json({
        message: "No error data available",
      });
      return;
    }
    const worksheet = xlsx.utils.json_to_sheet(jsonData.students);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Errored Data");

    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="errored-data.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    jsonData.students = [];
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
    res.send(excelBuffer);
  } catch (error) {
    errorResponse(res, error);
  }
}
