import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { serializeBigint, studentInclude } from ".";

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
      // postAllotment,
    } = req.body;
    let imageId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
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
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        fatherName,
        imageId,
        state,
        // postAllotment,
      },
      include: studentInclude,
    });

    res.status(200).json({
      message: "success",
      data: [serializeBigint(updatedStudent)],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
