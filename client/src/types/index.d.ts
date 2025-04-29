type Board = {
  id: string;
  name: string;
  description: string;
  enrollmentCount: number;
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
  enrollmentCount: number;
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
  // image: Asset | null;
  Enrollment: Enrollment[] | null;
};

type Enrollment = {
  id: string;
  post: string | null;
  rollNumber: bigint;
  selectionIn?: string;
  createdAt: Date;
  updatedAt: Date;
  resultId: string | null;
  studentId: string;
  examId: string;
  exam: Exam;
};

type Role = {
  id: string;
  name: string;
  exam: Action[];
  enrollment: Action[];
  board: Action[];
  student: Action[];
  user: Action[];
  role: Action[];
};

type Action = "read" | "create" | "update" | "delete";

type User = {
  id: string;
  email: string;
  role: Role | null;
};

type BooleanMap = { [key: string]: boolean };
