# Design: UI Framework Refactor

## Context
Current implementation uses Tamagui across both web and mobile platforms. We want to migrate to platform-specific UI frameworks:
- Web: shadcn/ui (built on Radix UI + Tailwind CSS)
- Mobile: BNA UI (React Native design system)

## Goals / Non-Goals

### Goals
- Use shadcn/ui on web for better React/Next.js integration
- Use BNA UI on mobile for React Native-optimized components
- Maintain existing functionality and user experience
- Improve developer experience with platform-appropriate tools

### Non-Goals
- Complete visual redesign (maintain current look and feel where possible)
- Changing application architecture or data flow
- Adding new features (this is purely a UI framework migration)

## Decisions

### Decision: Use shadcn/ui for Web
**Rationale**: 
- shadcn/ui is a popular, well-maintained component library for React/Next.js
- Built on Radix UI (accessibility-first) and Tailwind CSS (utility-first CSS)
- Components are copied into the project, giving full control
- Excellent TypeScript support
- Large ecosystem and community

**Alternatives considered**:
- Keep Tamagui (rejected: want platform-specific solutions)
- Material-UI/MUI (rejected: heavier, less customizable)
- Chakra UI (rejected: similar to Tamagui, want Tailwind-based solution)

### Decision: Use BNA UI for Mobile
**Rationale**: 
- TBD - Need to confirm what BNA UI is and its benefits
- Want React Native-focused design system

**Alternatives considered**:
- Keep Tamagui (rejected: want platform-specific solutions)
- NativeBase (rejected: TBD based on BNA UI research)
- React Native Paper (rejected: TBD based on BNA UI research)

### Decision: Incremental Migration Strategy
**Rationale**:
- Migrate page by page to reduce risk
- Can test each page independently
- Easier to rollback if issues arise

**Approach**:
1. Set up new frameworks first
2. Migrate auth pages (simpler, isolated)
3. Migrate upload functionality (core feature)
4. Migrate remaining pages
5. Remove old framework

## Risks / Trade-offs

### Risks
- **Visual inconsistencies**: New frameworks may render differently than Tamagui
  - *Mitigation*: Test each page thoroughly, adjust styles as needed
- **Missing components**: New frameworks may not have exact equivalents
  - *Mitigation*: Build custom components using base components, or adapt designs
- **Bundle size**: Tailwind CSS + shadcn/ui may increase web bundle size
  - *Mitigation*: Use Tailwind's purge/JIT mode, only include needed shadcn components
- **BNA UI unknowns**: Need to research and confirm BNA UI capabilities
  - *Mitigation*: Research phase before starting implementation

### Trade-offs
- **Platform divergence**: Web and mobile will use different frameworks
  - *Acceptable*: Different platforms benefit from different tools
- **Learning curve**: Team needs to learn new frameworks
  - *Acceptable*: Both are well-documented, popular frameworks
- **Migration effort**: Significant refactoring required
  - *Acceptable*: One-time cost for better long-term DX

## Migration Plan

### Phase 1: Setup (Web)
1. Install Tailwind CSS
2. Initialize shadcn/ui
3. Add base components needed
4. Remove Tamagui from build config
5. Update providers

### Phase 2: Setup (Mobile)
1. Research and install BNA UI
2. Configure provider
3. Remove Tamagui from build config
4. Update root layout

### Phase 3: Component Migration (Web)
1. Auth pages (login, register)
2. Dashboard pages
3. Upload functionality
4. Remaining pages

### Phase 4: Component Migration (Mobile)
1. Auth screens
2. Home/upload screen
3. Remaining screens

### Phase 5: Cleanup
1. Remove Tamagui dependencies
2. Update documentation
3. Final testing

## Open Questions
- [ ] What is BNA UI exactly? (package name, documentation URL)
- [ ] Should we maintain exact visual parity or allow platform-specific improvements?
- [ ] Do we need to migrate theme tokens/colors, or start fresh?
- [ ] Should we set up dark mode support in new frameworks?

