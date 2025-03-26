import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { serializeBigint, studentInclude } from ".";

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
      // postAllotment,
    } = req.body;

    let imageId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.location,
          type: req.file.mimetype,
        },
      });
      imageId = asset.id;
    }

    // const [month, date, year] = dateOfBirth?.split("-");
    const student = await prisma.student.create({
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
      include: {
        Enrollment: {
          include: {
            result: true,
            exam: true,
          },
        },
      },
    });
    res.status(200).json({
      message: "success",
      data: [serializeBigint(student)],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
