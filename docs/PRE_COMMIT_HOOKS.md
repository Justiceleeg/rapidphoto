# Pre-commit Hooks

This project uses [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to run linting and TypeScript checks before each commit.

## What Gets Checked

When you run `git commit`, the following checks run **only on staged files**:

### Web App (`apps/web`)
- ESLint for TypeScript/React files
- TypeScript type checking (no build)

### API (`apps/api`)
- ESLint for TypeScript files
- TypeScript type checking (no build)

### API Client (`packages/api-client`)
- TypeScript type checking (no build)

## Bypassing Hooks

Sometimes you need to commit without running the checks. Use the `--no-verify` flag:

```bash
git commit --no-verify -m "your commit message"
```

Or the short form:

```bash
git commit -n -m "your commit message"
```

## Running Checks Manually

You can run the checks manually at any time:

```bash
# Run linting on all projects
pnpm lint

# Run TypeScript checks on all projects
pnpm typecheck

# Run lint-staged manually (checks only staged files)
pnpm exec lint-staged
```

## Configuration Files

- `.husky/pre-commit` - The git hook script that runs before commit
- `.lintstagedrc.json` - Configuration for which commands to run on which files
- `package.json` - Contains the `prepare` script that installs husky hooks

## Troubleshooting

### Hook not running
Run `pnpm install` to reinstall husky hooks.

### Hook failing unexpectedly
- Check that all dependencies are installed: `pnpm install`
- Run the checks manually to see detailed errors: `pnpm lint && pnpm typecheck`
- If you need to commit anyway, use `--no-verify`

### Want to disable hooks completely
Delete the `.husky` directory or remove the `prepare` script from `package.json`.

