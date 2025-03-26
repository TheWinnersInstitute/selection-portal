import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { studentInclude } from ".";

export async function deleteStudent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.enrollment.deleteMany({
      where: {
        studentId: id,
      },
    });
    await prisma.student.delete({
      where: { id },
      include: studentInclude,
    });
    res.status(200).json({
      message: "success",
      data: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
