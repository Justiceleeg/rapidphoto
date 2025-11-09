import {
  RekognitionClient,
  DetectLabelsCommand,
  DetectLabelsCommandInput,
  Label,
} from "@aws-sdk/client-rekognition";
import { rekognitionConfig, MIN_CONFIDENCE_THRESHOLD } from "./rekognition.config.js";

/**
 * Service for AWS Rekognition image analysis
 * Detects objects, scenes, and concepts in images
 */
export class RekognitionService {
  private client: RekognitionClient;

  constructor() {
    this.client = new RekognitionClient(rekognitionConfig);
  }

  /**
   * Analyze an image and detect labels (objects, scenes, concepts)
   * Filters labels to only include those with confidence >= MIN_CONFIDENCE_THRESHOLD (70%)
   * 
   * @param imageBytes - Image data as Buffer
   * @returns Array of tag suggestions with confidence >= 70%
   */
  async detectLabels(imageBytes: Buffer): Promise<string[]> {
    try {
      const input: DetectLabelsCommandInput = {
        Image: {
          Bytes: imageBytes,
        },
        MaxLabels: 20, // Request up to 20 labels from Rekognition
        MinConfidence: MIN_CONFIDENCE_THRESHOLD, // Only return labels with >= 70% confidence
      };

      const command = new DetectLabelsCommand(input);
      const response = await this.client.send(command);

      // Extract label names and normalize (lowercase, sorted by confidence)
      const labels = response.Labels || [];
      const tags = labels
        .filter((label: Label) => 
          label.Name && 
          label.Confidence !== undefined && 
          label.Confidence >= MIN_CONFIDENCE_THRESHOLD
        )
        .sort((a: Label, b: Label) => (b.Confidence || 0) - (a.Confidence || 0)) // Sort by confidence (highest first)
        .map((label: Label) => label.Name!.toLowerCase())
        .filter((tag, index, self) => self.indexOf(tag) === index); // Deduplicate

      return tags;
    } catch (error) {
      console.error("[RekognitionService] Error detecting labels:", error);
      throw new Error("Failed to analyze image with AWS Rekognition");
    }
  }

  /**
   * Close the Rekognition client connection
   */
  async close(): Promise<void> {
    this.client.destroy();
  }
}

