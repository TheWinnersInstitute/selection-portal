import { Asset, Enrollment, Exam, Student } from "@prisma/client";

export * from "./create";
export * from "./delete";
export * from "./get";
export * from "./update";
export * from "./create-many";
export * from "./download-errored";

export const studentInclude = {
  image: true,
  Enrollment: {
    include: {
      result: true,
      exam: true,
    },
  },
};

interface EnrollmentType extends Enrollment {
  result: Asset | null;
  exam: Exam;
}

interface StudentType extends Student {
  Enrollment: EnrollmentType[];
}

export const serializeBigint = (student: StudentType) => {
  return {
    ...student,
    contactNumber: student.contactNumber.toString(),
    Enrollment:
      student.Enrollment?.map((enrollment) => {
        return {
          ...enrollment,
          rollNumber: enrollment.rollNumber.toString(),
        };
      }) || [],
  };
};
