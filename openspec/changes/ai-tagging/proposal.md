# Change: AI Tagging

## Why
Photos need to be automatically tagged using AI to improve searchability and user experience. Users waste time manually tagging photos when AI can provide intelligent suggestions. By leveraging AWS Rekognition, we can automatically detect objects, scenes, and concepts in photos with high confidence.

## What Changes
- Add `suggested_tags` field to photo schema for AI-generated tag suggestions
- Integrate AWS Rekognition for automatic image analysis
- Create AI tagging worker that processes photos after upload
- Add endpoints for users to accept/reject AI tag suggestions
- Display AI suggestions separately from user-confirmed tags on web and mobile
- Filter AI tags to only show high-confidence suggestions (≥70%)
- Queue AI tagging jobs automatically after photo upload completion

## Impact
- **Affected specs**: api, infrastructure, web, mobile
- **Affected code**:
  - Backend: Database schema, photo entity, repositories, AWS Rekognition integration, job queue workers, API endpoints
  - Frontend: PhotoModal (web), PhotoViewer (mobile), API client
- **Infrastructure**: Requires AWS credentials (Access Key, Secret Key, Region) for Rekognition service
- **Performance**: AI tagging runs asynchronously via job queue (no user-facing latency)
- **User Experience**: Users see AI-suggested tags immediately after upload and can accept/reject them with one click

