import { randomUUID } from "crypto";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { InitUploadCommand, InitUploadResult } from "./init-upload.command.js";

export class InitUploadHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  async handle(command: InitUploadCommand): Promise<InitUploadResult> {
    // Generate R2 key: userId/photoId/filename
    const photoId = randomUUID();
    const r2Key = `${command.userId}/${photoId}/${command.filename}`;

    // Create photo record with status "pending"
    const photo = await this.photoRepository.create({
      userId: command.userId,
      filename: command.filename,
      fileSize: command.fileSize,
      mimeType: command.mimeType,
      r2Key,
      r2Url: null,
      status: "pending",
    });

    // Generate presigned URL for upload
    const presignedUrl = await this.r2Service.generatePresignedUrl(
      r2Key,
      command.mimeType
    );

    return {
      photoId: photo.id,
      presignedUrl,
      r2Key,
    };
  }
}

