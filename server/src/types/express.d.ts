declare namespace Express {
  interface Request {
    session: {
      id: string;
      role: "admin" | "user";
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      hash: string;
    };
  }
}
