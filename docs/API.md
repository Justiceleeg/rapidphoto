# RapidPhoto API Documentation

This document describes all API endpoints, request/response formats, authentication requirements, and error handling.

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://api-production-xxxx.railway.app` (your Railway URL)

## Authentication

RapidPhoto uses **Better-Auth** for authentication with session-based authentication via HTTP-only cookies.

### Authentication Flow

1. **Register/Login**: POST to `/api/auth/signup` or `/api/auth/signin`
2. **Session Cookie**: Better-Auth sets an HTTP-only cookie with session token
3. **Protected Requests**: Include the session cookie in subsequent requests
4. **Session Expiry**: Sessions expire after 7 days of inactivity

### Authentication Headers

All protected endpoints require authentication. The session cookie is automatically included by browsers. For programmatic access:

```http
Cookie: better-auth.session_token=<session-token>
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes

- `AUTH_ERROR` (401): Authentication required or invalid
- `FORBIDDEN` (403): User doesn't have permission
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Request validation failed
- `INTERNAL_ERROR` (500): Server error

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Authentication

All authentication endpoints are handled by Better-Auth and mounted at `/api/auth/*`.

#### POST /api/auth/signup

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session-uuid",
    "expiresAt": "2025-11-14T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Email already exists or validation failed

#### POST /api/auth/signin

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session-uuid",
    "expiresAt": "2025-11-14T10:30:00Z"
  }
}
```

**Errors:**
- `401`: Invalid credentials

#### GET /api/auth/session

Get current session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session-uuid",
    "expiresAt": "2025-11-14T10:30:00Z"
  }
}
```

**Errors:**
- `401`: No active session

#### POST /api/auth/signout

Sign out current user.

**Response:**
```json
{
  "success": true
}
```

---

### Upload

#### POST /api/upload/init

Initialize photo upload (single or batch). Creates photo records and generates presigned URLs for direct client upload.

**Authentication:** Required

**Request Body:**
```json
{
  "photos": [
    {
      "filename": "photo1.jpg",
      "fileSize": 2048576,
      "mimeType": "image/jpeg"
    },
    {
      "filename": "photo2.jpg",
      "fileSize": 1536000,
      "mimeType": "image/jpeg"
    }
  ]
}
```

**Constraints:**
- Minimum: 1 photo
- Maximum: 100 photos per batch
- Supported MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

**Response:**
```json
{
  "jobId": "job-uuid",
  "uploads": [
    {
      "photoId": "photo-uuid-1",
      "presignedUrl": "https://r2.cloudflarestorage.com/...",
      "r2Key": "uploads/user-uuid/photo-uuid-1"
    },
    {
      "photoId": "photo-uuid-2",
      "presignedUrl": "https://r2.cloudflarestorage.com/...",
      "r2Key": "uploads/user-uuid/photo-uuid-2"
    }
  ]
}
```

**Upload Flow:**
1. Client receives presigned URLs
2. Client uploads files **directly to R2** using presigned URLs (PUT request)
3. Client notifies backend when upload completes: `POST /api/photos/:id/complete`

**Errors:**
- `401`: Authentication required
- `400`: Invalid request (too many photos, invalid MIME type, etc.)

---

### Photos

#### POST /api/photos/:id/complete

Mark a photo upload as completed. Updates photo status, upload job progress, and publishes SSE events.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user

#### POST /api/photos/:id/failed

Report a failed photo upload. Updates photo status, upload job progress, and publishes SSE events.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user

#### GET /api/photos

List photos with pagination and optional tag filtering.

**Authentication:** Required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `tags` (string[], optional): Filter by tags (AND logic)
- `includeSuggested` (boolean, optional): Include AI-suggested tags in search (default: false)

**Example:**
```
GET /api/photos?page=1&limit=20&tags[]=beach&tags[]=sunset&includeSuggested=true
```

**Response:**
```json
{
  "photos": [
    {
      "id": "photo-uuid",
      "filename": "photo1.jpg",
      "fileSize": 2048576,
      "mimeType": "image/jpeg",
      "status": "complete",
      "tags": ["beach", "sunset"],
      "suggestedTags": ["ocean", "sky"],
      "url": "https://r2.cloudflarestorage.com/...",
      "thumbnailUrl": "https://r2.cloudflarestorage.com/...",
      "uploadedAt": "2025-11-07T10:30:00Z",
      "createdAt": "2025-11-07T10:25:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Notes:**
- `url` and `thumbnailUrl` are presigned URLs that expire after 1 hour
- Only photos belonging to the authenticated user are returned
- Photos are sorted by `createdAt` descending (newest first)

**Errors:**
- `401`: Authentication required
- `400`: Invalid query parameters

#### GET /api/photos/:id

Get a single photo by ID.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Response:**
```json
{
  "id": "photo-uuid",
  "filename": "photo1.jpg",
  "fileSize": 2048576,
  "mimeType": "image/jpeg",
  "status": "complete",
  "tags": ["beach", "sunset"],
  "suggestedTags": ["ocean", "sky"],
  "url": "https://r2.cloudflarestorage.com/...",
  "thumbnailUrl": "https://r2.cloudflarestorage.com/...",
  "uploadedAt": "2025-11-07T10:30:00Z",
  "createdAt": "2025-11-07T10:25:00Z"
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user

#### GET /api/photos/:id/download

Download a photo file. Proxies the download from R2 with proper CORS headers.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Response:**
- Content-Type: Photo MIME type
- Content-Disposition: `attachment; filename="photo1.jpg"`
- Body: Photo file bytes

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user
- `400`: Photo is not ready for download (status != "complete")

#### DELETE /api/photos/:id

Delete a photo. Removes photo record from database (R2 object remains).

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user

#### PUT /api/photos/:id/tags

Update photo tags. Normalizes tags (lowercase, trim, deduplicate) before saving.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Request Body:**
```json
{
  "tags": ["beach", "sunset", "vacation"]
}
```

**Response:**
```json
{
  "id": "photo-uuid",
  "tags": ["beach", "sunset", "vacation"]
}
```

**Tag Normalization:**
- Converted to lowercase
- Trimmed whitespace
- Duplicates removed
- Empty tags filtered out

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user
- `400`: Invalid tags (validation failed)

#### POST /api/photos/:id/tags/accept

Accept an AI-suggested tag. Moves tag from `suggestedTags` to confirmed `tags`.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Request Body:**
```json
{
  "tag": "ocean"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user
- `400`: Tag not found in suggested tags

#### POST /api/photos/:id/tags/reject

Reject an AI-suggested tag. Removes tag from `suggestedTags` without adding to confirmed `tags`.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Photo ID

**Request Body:**
```json
{
  "tag": "sky"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Authentication required
- `404`: Photo not found
- `403`: Photo doesn't belong to user
- `400`: Tag not found in suggested tags

---

### Tags

#### GET /api/tags

Get distinct tags for the authenticated user. Supports optional prefix filtering for autocomplete.

**Authentication:** Required

**Query Parameters:**
- `prefix` (string, optional): Filter tags by prefix (case-insensitive)

**Example:**
```
GET /api/tags?prefix=bea
```

**Response:**
```json
{
  "tags": ["beach", "beautiful", "beauty"]
}
```

**Notes:**
- Returns only user-confirmed tags (not AI-suggested tags)
- Tags are sorted alphabetically
- Useful for autocomplete/search suggestions

**Errors:**
- `401`: Authentication required

---

### Upload Jobs

#### GET /api/upload-jobs/:id

Get upload job by ID. Returns upload job details with progress information.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Upload job ID

**Response:**
```json
{
  "id": "job-uuid",
  "userId": "user-uuid",
  "totalPhotos": 100,
  "completedPhotos": 45,
  "failedPhotos": 2,
  "status": "in_progress",
  "createdAt": "2025-11-07T10:25:00Z",
  "completedAt": null
}
```

**Status Values:**
- `pending`: Job created, uploads not started
- `in_progress`: Some uploads completed, more pending
- `complete`: All uploads completed successfully
- `failed`: All uploads failed

**Errors:**
- `401`: Authentication required
- `404`: Upload job not found
- `403`: Upload job doesn't belong to user

---

### Server-Sent Events (SSE)

#### GET /api/upload-progress/:jobId

SSE endpoint for upload progress. Streams real-time progress events for batch uploads.

**Authentication:** Required

**Path Parameters:**
- `jobId` (string, required): Upload job ID

**Response:** Server-Sent Events stream

**Event Format:**
```json
{
  "jobId": "job-uuid",
  "photoId": "photo-uuid",
  "fileName": "photo1.jpg",
  "status": "complete",
  "completedCount": 45,
  "totalCount": 100,
  "failedCount": 2,
  "timestamp": "2025-11-07T10:30:00Z"
}
```

**Event Types:**
- Initial state: Sent immediately on connection
- Progress updates: Sent when each photo completes/fails
- Ping: Sent every 30 seconds to keep connection alive

**Connection Management:**
- Connection automatically closes when job is completed or failed
- Client should reconnect if connection drops
- Browser EventSource API handles reconnection automatically

**Example Client Code:**
```javascript
const eventSource = new EventSource(`/api/upload-progress/${jobId}`, {
  withCredentials: true
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgressUI(data);
};

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
  eventSource.close();
};
```

**Errors:**
- `401`: Authentication required
- `404`: Upload job not found
- `403`: Upload job doesn't belong to user
- `500`: Failed to set up progress stream

---

## Rate Limiting

Currently, there are no rate limits enforced. Future versions may include:
- Per-user upload limits
- API rate limiting
- DDoS protection

## CORS

CORS is configured to allow requests from:
- Development: `http://localhost:3000` (web), Expo Go (mobile)
- Production: Configured via `ALLOWED_ORIGINS` environment variable

## Presigned URLs

Presigned URLs are generated for:
- **Upload**: PUT request to R2 (expires in 1 hour)
- **View**: GET request to R2 (expires in 1 hour)

Presigned URLs are time-limited and user-specific, ensuring secure access to photos.

## Best Practices

1. **Handle Errors Gracefully**: Always check response status and handle errors appropriately
2. **Use Pagination**: For photo lists, use pagination to avoid loading too many photos at once
3. **Cache Presigned URLs**: URLs expire after 1 hour, so refresh them as needed
4. **Monitor SSE Connections**: Handle SSE connection errors and reconnect if needed
5. **Validate File Types**: Only upload supported image formats (JPEG, PNG, WebP, GIF)
6. **Batch Uploads**: Use batch upload for multiple photos (up to 100) for better performance

## Examples

### Complete Upload Flow

```javascript
// 1. Initialize upload
const initResponse = await fetch('/api/upload/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    photos: [
      { filename: 'photo1.jpg', fileSize: 2048576, mimeType: 'image/jpeg' }
    ]
  })
});

const { jobId, uploads } = await initResponse.json();

// 2. Upload directly to R2
const uploadPromises = uploads.map(async (upload) => {
  const file = getFileForPhoto(upload.photoId);
  const response = await fetch(upload.presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  });
  
  if (response.ok) {
    // 3. Notify backend of completion
    await fetch(`/api/photos/${upload.photoId}/complete`, {
      method: 'POST',
      credentials: 'include'
    });
  }
});

await Promise.allSettled(uploadPromises);

// 4. Listen for progress updates
const eventSource = new EventSource(`/api/upload-progress/${jobId}`, {
  withCredentials: true
});

eventSource.onmessage = (event) => {
  const progress = JSON.parse(event.data);
  console.log(`Progress: ${progress.completedCount}/${progress.totalCount}`);
};
```

### Search Photos by Tags

```javascript
const response = await fetch('/api/photos?tags[]=beach&tags[]=sunset&includeSuggested=true', {
  credentials: 'include'
});

const { photos, pagination } = await response.json();
```

### Get Tags for Autocomplete

```javascript
const response = await fetch('/api/tags?prefix=bea', {
  credentials: 'include'
});

const { tags } = await response.json();
// Returns: ["beach", "beautiful", "beauty"]
```

