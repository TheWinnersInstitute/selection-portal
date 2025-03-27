import { Request, Response } from "express";
import { errorResponse, prisma, RedisClient } from "../../lib";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";

export async function queueStatus(req: Request, res: Response) {
  res.json({
    message: "Previous upload already in process",
    data: [RedisClient.Instance.queueLength],
  });
}

export async function createStudents(
  req: Request,
  res: Response
): Promise<void> {
  if (RedisClient.Instance.queueLength !== 0) {
    res.status(400).json({
      message: "Previous upload already in process",
      data: [RedisClient.Instance.queueLength],
    });
    return;
  }
  const tempFilePath = path.join(
    __dirname,
    "../../../assets/errored-data.xlsx"
  );
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      res.status(400).json({
        message: "No data in the file",
      });
      return;
    }

    const exams = (await prisma.exam.findMany({})).reduce((prev, exam) => {
      prev[exam.name] = exam.id;
      return prev;
    }, {} as { [key: string]: string });

    for (let i = 0; i < 50; i++) {
      const row = sheetData[i];
      await RedisClient.Instance.addToQueue({
        row,
        exams,
      });
    }
    res.status(200).json({
      message: `Added ${sheetData.length} students to the queue`,
      data: [sheetData.length],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
