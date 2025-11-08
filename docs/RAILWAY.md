# Railway Deployment Guide

This document outlines Railway deployment best practices and common issues encountered when deploying monorepo applications.

## Core Principles

- **Railway uses Railpack** - Railway uses Railpack (not Nixpacks) for building applications
- **Monorepo root directory** - Always set the "Root Directory" to `/` in the Railway dashboard for monorepo deployments
- **Workspace packages** - Build workspace packages in dependency order (e.g., `@rapidphoto/api-client` before `@rapidphoto/web`)
- **Configuration files** - Use `railpack.json` at the repo root for custom build configurations

## Monorepo Configuration

### Root Directory

**Critical**: Set the "Root Directory" to `/` in the Railway dashboard for each service. This ensures Railway runs commands from the monorepo root where `pnpm-workspace.yaml` is located.

### Railpack Configuration

Create a `railpack.json` file at the repository root to customize the build process:

```json
{
  "$schema": "https://schema.railpack.com",
  "steps": {
    "build": {
      "commands": [
        "...",
        "pnpm --filter @rapidphoto/api-client build",
        "pnpm --filter @rapidphoto/web build"
      ]
    }
  },
  "deploy": {
    "startCommand": "pnpm --filter @rapidphoto/web start"
  }
}
```

**Key points:**
- Use `"..."` array extending syntax to extend Railpack's auto-generated build commands
- Let Railpack handle the install step automatically (don't override it)
- Build workspace packages in dependency order
- The first step cannot have local file inputs (Railpack handles this automatically)

### Railway.json Configuration

Each service can have its own `railway.json` file (e.g., `apps/web/railway.json`):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "buildCommand": "pnpm install && pnpm --filter @rapidphoto/api-client build && pnpm --filter @rapidphoto/web build"
  },
  "deploy": {
    "startCommand": "pnpm --filter @rapidphoto/web start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Important:**
- **Do NOT set `watchPatterns`** unless absolutely necessary - it prevents deployments when root files (like `railpack.json`) change
- If you must use `watchPatterns`, ensure it includes all files that should trigger deployments

## Common Issues and Solutions

### Issue: `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

**Error**: `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND In : "@rapidphoto/api-client@workspace:*" is in the dependencies but no package named "@rapidphoto/api-client" is present in the workspace`

**Causes:**
1. Root directory not set to `/` in Railway dashboard
2. Railway's automatic install step not detecting workspace
3. Custom build steps overriding Railpack's file copying

**Solutions:**
1. Verify "Root Directory" is set to `/` in Railway dashboard
2. Use `railpack.json` with array extending syntax (`"..."`) instead of overriding steps
3. Let Railpack handle the install step automatically

### Issue: `ERR_PNPM_NO_PKG_MANIFEST`

**Error**: `ERR_PNPM_NO_PKG_MANIFEST  No package.json found in /app`

**Cause**: Custom steps in `railpack.json` overriding Railpack's automatic file copying

**Solution**: Remove custom `install` step and let Railpack handle it automatically. Use array extending syntax to add to build commands:

```json
{
  "steps": {
    "build": {
      "commands": [
        "...",
        "your-custom-commands"
      ]
    }
  }
}
```

### Issue: Deployments Not Triggering

**Symptom**: Changes to root files (like `railpack.json`) don't trigger deployments

**Cause**: `watchPatterns` in `railway.json` restricting which files trigger deployments

**Solution**: Remove `watchPatterns` from `railway.json` or ensure it includes all relevant paths

### Issue: Build Step Input Validation Error

**Error**: `✖ 'install' inputs must be an image or step input`

**Cause**: The first step in `railpack.json` cannot have local file inputs

**Solution**: Remove `inputs` from the first step. Railpack automatically copies local files for the first step.

## Best Practices

1. **Always set root directory to `/`** for monorepo services
2. **Use `railpack.json`** for custom build configurations
3. **Extend, don't override** - Use `"..."` syntax to extend Railpack's auto-generated steps
4. **Build in dependency order** - Build workspace packages that other packages depend on first
5. **Avoid `watchPatterns`** unless necessary - It can prevent deployments when root files change
6. **Let Railpack handle install** - Don't override the install step unless absolutely necessary

## Service-Specific Configuration

### API Service

- Root directory: `/`
- Build command: Handled by `railpack.json` or `apps/api/railway.json`
- Start command: `pnpm --filter @rapidphoto/api start`

### Web Service

- Root directory: `/`
- Build command: Handled by `railpack.json` or `apps/web/railway.json`
- Start command: `pnpm --filter @rapidphoto/web start`
- Environment variables: Set `NEXT_PUBLIC_API_URL` for API endpoint

## References

- [Railpack Configuration Documentation](https://railpack.com/config/file)
- [Railway Documentation](https://docs.railway.app/)
- Railway Dashboard: Settings → Build → Root Directory

