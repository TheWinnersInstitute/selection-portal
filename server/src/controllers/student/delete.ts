import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { studentInclude } from ".";

export async function deleteStudent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        Enrollment: true,
        image: true,
      },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    await prisma.enrollment.deleteMany({ where: { studentId: id } });

    if (student.imageId) {
      await prisma.asset.delete({ where: { id: student.imageId } });
    }

    await prisma.student.delete({ where: { id } });
    res.status(200).json({
      message: "success",
      data: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
