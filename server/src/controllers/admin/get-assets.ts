import { Request, Response } from "express";
import { errorResponse, prisma, RedisClient, S3 } from "../../lib";

export async function getAsset(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { _cache } = req.query;
    const targetAsset = await prisma.asset.findUnique({
      where: {
        id,
      },
    });

    const cache = _cache === "true";

    if (!targetAsset)
      return errorResponse(res, new Error("Asset not found"), 404);

    const cacheKey = `asset:${id}`;
    if (cache) {
      const cachedData = await RedisClient.Instance.redisClient.getBuffer(
        cacheKey
      );

      if (cachedData) {
        res.setHeader("Content-Type", targetAsset.type);
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.end(cachedData);
        return;
      }
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: targetAsset.path,
    };

    const s3Stream = S3.instance.s3.getObject(params).createReadStream();

    const chunks: Buffer[] = [];
    s3Stream.on("data", (chunk) => chunks.push(chunk));
    s3Stream.on("end", async () => {
      const fileBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", targetAsset.type);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.end(fileBuffer);

      if (cache) {
        await RedisClient.Instance.redisClient.set(
          cacheKey,
          fileBuffer,
          "EX",
          60 * 60 * 24
        );
      }
    });

    s3Stream.on("error", (err) => {
      console.error("S3 Stream Error:", err);
      res.status(500).send("Error streaming asset");
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
