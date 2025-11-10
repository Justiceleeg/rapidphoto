## 1. Backend - Tag Search & Autocomplete APIs
- [x] 1.1 Extend GetPhotosQuery to support tag filtering (`apps/api/src/application/queries/get-photos/get-photos.query.ts` - add `tags?: string[]` and `includeSuggested?: boolean`)
- [x] 1.2 Update GetPhotosHandler with tag search logic (`apps/api/src/application/queries/get-photos/get-photos.handler.ts` - use PostgreSQL array operators @> and && with AND logic, support includeSuggested flag)
- [x] 1.3 Update photo routes to accept search parameters (`apps/api/src/infrastructure/http/routes/photo.routes.ts` - add query parameters to GET /api/photos endpoint)
- [x] 1.4 Test tag search API (verify search by user tags only, search including AI suggestions, multi-tag search with AND logic, pagination still works)
- [x] 1.5 Create GetTagsQuery DTO (`apps/api/src/application/queries/get-tags/get-tags.query.ts` - support `prefix?: string` parameter)
- [x] 1.6 Create GetTagsHandler (`apps/api/src/application/queries/get-tags/get-tags.handler.ts` - return distinct tags from tags array, support prefix matching, limit results, filter by user's photos only)
- [x] 1.7 Add tag autocomplete endpoint (`apps/api/src/infrastructure/http/routes/photo.routes.ts` - GET /api/photos/tags?prefix=bea)
- [x] 1.8 Test tag autocomplete API (verify get all tags, get tags with prefix, verify only user-confirmed tags returned)

## 2. Web Frontend - Tag Search & Autocomplete
- [x] 2.1 Update photo client with search parameters (`packages/api-client/src/photo.client.ts` - add `tags` and `includeSuggested` parameters to `getPhotos` method)
- [x] 2.2 Update TagInput to use autocomplete API (`apps/web/components/gallery/TagInput.tsx` - fetch suggestions from GET /api/photos/tags?prefix=..., show dropdown, debounce API calls)
- [x] 2.3 Create TagSearch component (`apps/web/components/gallery/TagSearch.tsx` - search input with TagInput, multi-tag selection with chips, checkbox for "Include AI-suggested tags", clear search button)
- [x] 2.4 Add TagSearch to gallery page (`apps/web/app/dashboard/gallery/page.tsx` - add TagSearch above PhotoGrid, pass search parameters to photo query, update React Query when search changes)
- [x] 2.5 Test tag search on web (verify single tag search, multi-tag search with AND logic, toggle "Include AI-suggested tags", clear search, verify autocomplete works)

## 3. Mobile Frontend - Tag Search
- [x] 3.1 Add search input to mobile gallery screen (`apps/mobile/app/(tabs)/gallery.tsx` - add search input at top, tag autocomplete, "Include AI-suggested tags" toggle)
- [x] 3.2 Test tag search on mobile (verify search by tags, toggle AI suggestions in search, verify autocomplete works, test on iOS and Android)

## 4. Deploy Tag Search
- [ ] 4.1 Redeploy all services with tag search (push changes, verify Railway auto-deploys)
- [ ] 4.2 Test tag search in production (verify search by user tags, search including AI suggestions, multi-tag search, test autocomplete, verify on web and mobile)

