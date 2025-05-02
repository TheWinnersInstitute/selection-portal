import {
  Asset,
  Enrollment,
  Exam,
  ExamCategory,
  Prisma,
  Student,
} from "@prisma/client";

export * from "./create";
export * from "./delete";
export * from "./get";
export * from "./update";
export * from "./create-many";
export * from "./download-errored";

export const studentInclude = {
  Enrollment: {
    include: {
      exam: true,
      examCategory: true,
    },
  },
};

interface EnrollmentType extends Enrollment {
  exam: Exam;
  examCategory: ExamCategory | null;
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
