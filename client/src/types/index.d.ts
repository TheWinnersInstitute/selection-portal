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
  examCategories: ExamCategory[];
};

type ExamCategory = {
  id: string;
  name: string;
  examId: string;
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
  examCategory: ExamCategory;
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
  luckyDraw: Action[];
};

type LuckyDraw = {
  id: string;
  name: string;
  openingDate: string;
  participationEndDate: string;
  bannerId?: string;
  participantsCount?: number;
};

type LuckyDrawReward = {
  name: string;
  id: string;
  luckyDrawId: string;
  count: number;
  assetId: string | null;
};

type LuckyDrawParticipant = {
  id: string;
  luckyDrawId: string;
  name: string;
  email: string;
  phone: string;
  isWinner: boolean;
  profileId: string | null;
  luckyDrawRewardId: string | null;
};

type Action = "read" | "create" | "update" | "delete";

type User = {
  id: string;
  email: string;
  role: Role | null;
};

type BooleanMap = { [key: string]: boolean };

type Asset = {
  id: string;
  path: string;
  type: string;
};
