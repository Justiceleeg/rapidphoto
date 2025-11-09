/**
 * Command to mark a photo upload as completed
 */
export interface CompletePhotoCommand {
  /** ID of the photo to mark as completed */
  photoId: string;
  /** ID of the user who owns the photo */
  userId: string;
}

