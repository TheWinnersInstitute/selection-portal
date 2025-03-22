import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function createStudent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      email,
      name,
      city,
      contactNumber,
      dateOfBirth,
      fatherName,
      state,
      postAllotment,
    } = req.body;

    let imageId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          path: req.file.path,
          type: req.file.mimetype,
        },
      });
      imageId = asset.id;
    }

    const student = await prisma.student.create({
      data: {
        email,
        name,
        city,
        contactNumber,
        dateOfBirth,
        fatherName,
        imageId,
        state,
        postAllotment,
      },
    });
    res.status(200).json({
      message: "success",
      data: [student],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
