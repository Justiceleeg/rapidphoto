/**
 * Command to mark a photo upload as failed
 */
export interface FailPhotoCommand {
  /** ID of the photo to mark as failed */
  photoId: string;
  /** ID of the user who owns the photo */
  userId: string;
}

