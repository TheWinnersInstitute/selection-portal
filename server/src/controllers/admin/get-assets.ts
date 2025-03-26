import { Request, Response } from "express";
import { errorResponse, prisma, S3 } from "../../lib";

export async function getAsset(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const targetAsset = await prisma.asset.findUnique({
      where: {
        id,
      },
    });

    if (!targetAsset)
      return errorResponse(res, new Error("Asset not found"), 404);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: targetAsset.path,
    };

    const s3Stream = S3.instance.s3.getObject(params).createReadStream();
    res.setHeader("Content-Type", targetAsset.type);
    res.setHeader("Cache-Control", "public, max-age=31536000");

    s3Stream.pipe(res);

    s3Stream.on("error", (err) => {
      console.error("S3 Stream Error:", err);
      res.status(500).send("Error streaming image");
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
