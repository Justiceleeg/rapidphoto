# Impact Analysis: UI Framework Refactor on Active OpenSpec Changes

## Active Changes Status
- `backend-gallery-queries` (0/14 tasks) - Backend API work
- `deploy-gallery` (0/4 tasks) - Deployment work
- `mobile-gallery` (0/6 tasks) - Mobile UI components
- `web-gallery` (0/10 tasks) - Web UI components

## Impact by Change

### ✅ backend-gallery-queries
**Status**: Not affected
- Backend API work only
- No UI components involved
- Can proceed independently

### ✅ deploy-gallery
**Status**: Not affected
- Deployment configuration only
- No code changes
- Can proceed independently

### ⚠️ web-gallery
**Status**: **DEPENDENT** - Should be implemented AFTER UI refactor
- Creates new UI components:
  - `PhotoGrid.tsx` - Currently would use Tamagui
  - `PhotoModal.tsx` - Currently would use Tamagui
  - `TagInput.tsx` - Currently would use Tamagui
- **Recommendation**: Implement UI refactor first, then build gallery components with shadcn/ui
- **Alternative**: If gallery is done first, those components will need migration from Tamagui to shadcn/ui

### ⚠️ mobile-gallery
**Status**: **DEPENDENT** - Should be implemented AFTER UI refactor
- Creates new UI components:
  - `PhotoGrid.tsx` - Currently would use Tamagui
  - `PhotoViewer.tsx` - Currently would use Tamagui
- **Recommendation**: Implement UI refactor first, then build gallery components with BNA UI
- **Alternative**: If gallery is done first, those components will need migration from Tamagui to BNA UI

## Recommended Order of Operations

### Option 1: UI Refactor First (Recommended)
1. ✅ Complete `backend-gallery-queries` (independent)
2. 🔄 Complete `refactor-ui-frameworks` (foundational change)
3. 🔄 Complete `web-gallery` (build with shadcn/ui from start)
4. 🔄 Complete `mobile-gallery` (build with BNA UI from start)
5. ✅ Complete `deploy-gallery` (deploy everything together)

**Benefits**:
- Gallery components built with correct frameworks from the start
- No migration work needed
- Cleaner implementation

### Option 2: Gallery First (Not Recommended)
1. ✅ Complete `backend-gallery-queries`
2. 🔄 Complete `web-gallery` (build with Tamagui)
3. 🔄 Complete `mobile-gallery` (build with Tamagui)
4. 🔄 Complete `refactor-ui-frameworks` (migrate existing components + new gallery components)
5. ✅ Complete `deploy-gallery`

**Drawbacks**:
- Gallery components need migration immediately after creation
- More work overall
- Risk of inconsistencies

## Action Items

### If proceeding with UI refactor first:
- [ ] Update `web-gallery/tasks.md` to note components should use shadcn/ui
- [ ] Update `mobile-gallery/tasks.md` to note components should use BNA UI
- [ ] Update `web-gallery/specs/web/spec.md` if needed (specs are framework-agnostic)
- [ ] Update `mobile-gallery/specs/mobile/spec.md` if needed (specs are framework-agnostic)

### If proceeding with gallery first:
- [ ] Note in `web-gallery` and `mobile-gallery` that components will need migration
- [ ] Plan migration tasks in `refactor-ui-frameworks/tasks.md` to include gallery components

