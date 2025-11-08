# Styling Conventions

This project uses **Tamagui** for all UI components and styling. Do not add custom CSS or inline styles.

## Core Principles

- **Use Tamagui components only** - All UI components come from the `tamagui` package
- **Use theme tokens** - All colors, spacing, and other design tokens come from the Tamagui theme
- **No custom CSS** - Do not add custom CSS files, inline styles, or style props that aren't part of Tamagui
- **No theme prop with invalid values** - Theme names must be valid (see below)

## Theme Tokens

Use theme tokens from `tamagui.config.ts`:

- **Colors**: `$blue9`, `$gray8`, `$red10`, etc. (see `tamagui.config.ts` for available colors)
- **Spacing**: `$2`, `$4`, `$6`, etc.
- **Shadows**: `$shadow1`, `$shadow2`, etc.

Example:
```tsx
<YStack
  backgroundColor="$blue2"
  borderColor="$blue9"
  padding="$6"
  borderRadius="$4"
>
```

## Valid Theme Names

When using the `theme` prop on components, use valid theme names:

- Base themes: `light`, `dark`
- Color themes: `light_blue`, `dark_blue`, `light_green`, `dark_green`, etc.
- Component themes: `warning`, `error`, `success`

**Do NOT use**: `"blue"`, `"red"`, etc. as standalone theme names. These are invalid.

Example:
```tsx
// ✅ Correct
<Button theme="light_blue">Click me</Button>

// ❌ Wrong
<Button theme="blue">Click me</Button>
```

## Component Usage

Use Tamagui components from the `tamagui` package:

```tsx
import { YStack, XStack, Button, Text, H1 } from "tamagui";
```

## Configuration Files

- Web: `apps/web/tamagui.config.ts`
- Mobile: `apps/mobile/tamagui.config.ts`

Refer to these files to see available theme tokens and configuration.

## Common Mistakes to Avoid

1. ❌ Adding `theme="blue"` - Use `theme="light_blue"` or `theme="dark_blue"` instead
2. ❌ Using inline styles like `style={{ color: 'blue' }}` - Use theme tokens like `color="$blue9"`
3. ❌ Adding custom CSS files - All styling should come from Tamagui
4. ❌ Using raw color values - Always use theme tokens (e.g., `$blue9` not `#0066ff`)

