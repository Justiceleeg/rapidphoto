## ADDED Requirements

### Requirement: Monorepo Structure
The project SHALL use a pnpm-based monorepo structure with workspace configuration to manage multiple applications and shared packages.

#### Scenario: Workspace configuration
- **WHEN** a developer runs `pnpm install` at the root
- **THEN** all workspace packages in `apps/*` and `packages/*` are linked and dependencies are installed

#### Scenario: Root folder structure
- **WHEN** the monorepo is initialized
- **THEN** the root directory contains `apps/`, `packages/`, `.github/`, and `package.json`

### Requirement: Workspace Scripts
The root package.json SHALL provide workspace-level scripts for development, building, and testing across all packages.

#### Scenario: Parallel development
- **WHEN** a developer runs `pnpm dev` at the root
- **THEN** all workspace packages with a `dev` script run in parallel

#### Scenario: Filtered development
- **WHEN** a developer runs `pnpm dev:web` at the root
- **THEN** only the `@rapidphoto/web` package's dev script executes

#### Scenario: Build all packages
- **WHEN** a developer runs `pnpm build` at the root
- **THEN** all workspace packages with a `build` script execute sequentially

### Requirement: Git Configuration
The monorepo SHALL include a comprehensive `.gitignore` file that excludes node_modules, build artifacts, environment files, and platform-specific files.

#### Scenario: Ignore node_modules
- **WHEN** files are staged for commit
- **THEN** `node_modules/` directories at any level are excluded

#### Scenario: Ignore build artifacts
- **WHEN** files are staged for commit
- **THEN** `dist/`, `build/`, `.next/`, and `.expo/` directories are excluded

#### Scenario: Ignore environment files
- **WHEN** files are staged for commit
- **THEN** `.env` and `.env.local` files are excluded

### Requirement: Environment Variable Template
The monorepo SHALL include a `.env.example` file documenting required environment variables.

#### Scenario: Environment setup
- **WHEN** a developer clones the repository
- **THEN** they can reference `.env.example` to understand required environment variables

