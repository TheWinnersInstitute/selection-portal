type Board = {
  id: string;
  name: string;
  description: string;
};

type Exam = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  boardId: string;
  description: string;
  examDate: Date;
  examStatus: "pending" | "ongoing" | "completed";
};
type Student = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  dateOfBirth: Date | null;
  contactNumber: string | null;
  fatherName: string | null;
  city: string | null;
  state: string | null;
  postAllotment: string | null;
  imageId: string | null;
  image: Asset | null;
  Enrollment:
    | {
        id: string;
        post: string | null;
        rollNumber: bigint;
        createdAt: Date;
        updatedAt: Date;
        resultId: string | null;
        studentId: string;
        examId: string;
        result: Asset;
        exam: Exam;
      }[]
    | null;
};

type Asset = {
  id: string;
  path: string;
  type: string;
};
