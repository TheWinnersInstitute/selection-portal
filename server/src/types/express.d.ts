declare namespace Express {
  interface Request {
    session: {
      id: string;
      role: {
        id: string;
        name: string;
        exam: Action[];
        enrollment: Action[];
        board: Action[];
        student: Action[];
      };
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      hash: string;
    };
  }
}

type Model = "exam" | "enrollment" | "board" | "student" | "user" | "role";
type Action = "read" | "create" | "update" | "delete";
