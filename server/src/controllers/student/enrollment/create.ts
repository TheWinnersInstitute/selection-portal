import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function createEnrollment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      post,
      studentId,
      examId,
      rank,
      rollNumber,
      selectionIn,
      examCategoryId,
      year,
    } = req.body;

    let resultId;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      resultId = asset.id;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        rollNumber: parseInt(rollNumber, 10),
        examId,
        rank,
        studentId,
        post,
        resultId,
        selectionIn,
        year: parseInt(year) || null,
        examCategoryId,
      },
      include: {
        exam: true,
        examCategory: true,
      },
    });

    // @ts-ignore
    enrollment.rollNumber = enrollment.rollNumber.toString();
    res.status(200).json({
      message: "success",
      data: [enrollment],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
