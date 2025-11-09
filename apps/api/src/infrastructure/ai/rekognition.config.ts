import { RekognitionClientConfig } from "@aws-sdk/client-rekognition";
import { env } from "../../config/env.js";

/**
 * AWS Rekognition client configuration
 * Uses credentials from environment variables
 */
export const rekognitionConfig: RekognitionClientConfig = {
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
};

/**
 * Minimum confidence threshold for AI tag suggestions (70%)
 * Only labels with confidence >= this value will be stored
 */
export const MIN_CONFIDENCE_THRESHOLD = 70;

