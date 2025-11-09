# Change: Tag Search & Autocomplete

## Why
Users need to quickly find photos by tags to manage large photo collections efficiently. Manual browsing through hundreds of photos is time-consuming. By adding tag search with autocomplete, users can instantly filter their gallery to find specific photos. Additionally, users should be able to search using AI-suggested tags (not just user-confirmed tags) to discover photos that AI has identified but haven't been manually tagged yet.

## What Changes
- Add tag filtering to photo query API (search by user tags and optionally AI-suggested tags)
- Create tag autocomplete API endpoint for prefix-based tag suggestions
- Add TagSearch component to web gallery with multi-tag selection and AI suggestions toggle
- Add tag search input to mobile gallery screen with autocomplete
- Support multi-tag search with AND logic (photos must match all selected tags)
- Use PostgreSQL GIN indexes (already created) for efficient tag array queries

## Impact
- **Affected specs**: api, web, mobile
- **Affected code**:
  - Backend: GetPhotosQuery, GetPhotosHandler, photo routes, new GetTagsQuery/Handler
  - Frontend: PhotoGrid components, gallery pages, TagInput components, API client
- **Infrastructure**: No new infrastructure required (uses existing GIN indexes on tags and suggested_tags)
- **Performance**: Tag search uses PostgreSQL array operators with GIN indexes for fast queries
- **User Experience**: Users can quickly find photos by typing tag names with autocomplete suggestions, and optionally include AI-suggested tags in search results

