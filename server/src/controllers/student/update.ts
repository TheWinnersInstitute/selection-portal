import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function updateStudent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      id,
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

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
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
      data: [updatedStudent],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
