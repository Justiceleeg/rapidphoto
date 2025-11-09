# Styling Conventions

This project uses **shadcn/ui with Tailwind CSS** for the web frontend (`apps/web`) and **BNA UI** for the mobile app (`apps/mobile`).

## Web Frontend (apps/web)

### Framework: shadcn/ui + Tailwind CSS v4

The web app uses [shadcn/ui](https://ui.shadcn.com/) components built on top of [Radix UI](https://www.radix-ui.com/) and styled with [Tailwind CSS v4](https://tailwindcss.com/).

### Core Principles

- **Use shadcn/ui components** - UI components are in `apps/web/components/ui/`
- **Use Tailwind utility classes** - Style with Tailwind classes, not custom CSS
- **Use CSS variables for theming** - Theme colors defined in `globals.css`
- **Extend with component variants** - Use `class-variance-authority` for complex variants

### Component Usage

Import shadcn/ui components from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

Example usage:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
    <Button className="w-full">Login</Button>
  </CardContent>
</Card>
```

### Styling with Tailwind

Use Tailwind utility classes for layout and styling:

```tsx
// Layout
<div className="flex flex-col gap-4 p-6">
  <div className="grid grid-cols-2 gap-4">
    ...
  </div>
</div>

// Spacing
<div className="px-4 py-6 mt-8 mb-4">

// Colors (use theme variables)
<div className="bg-background text-foreground border-border">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
```

### Theme Variables

Theme colors are defined as CSS variables in `apps/web/app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.375 0.168 263.8);
  --primary-foreground: oklch(1 0 0);
  /* ... more variables ... */
}
```

Access theme colors via Tailwind classes:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`, `ring-ring`

### Adding New Components

To add a shadcn/ui component:

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

This will:
1. Add the component to `components/ui/`
2. Install any required dependencies
3. Update `components.json` if needed

### Configuration Files

- **Tailwind Config**: Inline in `apps/web/app/globals.css` using `@theme`
- **PostCSS Config**: `apps/web/postcss.config.mjs`
- **shadcn/ui Config**: `apps/web/components.json`
- **Theme Variables**: `apps/web/app/globals.css`

### Common Patterns

```tsx
// Card with content
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>

// Form with labels
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Field Label</Label>
    <Input id="field" placeholder="Enter value" />
  </div>
</div>

// Button variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

### Common Mistakes to Avoid

1. ❌ Using inline styles - Use Tailwind classes instead
2. ❌ Custom CSS files - Extend Tailwind config if needed
3. ❌ Hard-coded colors - Use theme variables (`bg-primary`, not `bg-blue-500`)
4. ❌ Importing from `react` instead of `next` - Use Next.js-specific imports when available

---

## Mobile App (apps/mobile)

### Framework: BNA UI

The mobile app uses [BNA UI](https://ui.ahmedbna.com/), an Expo React Native UI component library inspired by shadcn/ui.

### Core Principles

- **Use BNA UI components** - UI components are in `apps/mobile/components/ui/`
- **Use React Native StyleSheet** - Style with StyleSheet.create(), not inline styles
- **Use theme colors from hooks** - Access colors via `useColor()` hook
- **Keep animations simple** - Avoid complex animations that require native builds

### Component Usage

Import BNA UI components from `@/components/ui`:

```tsx
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

Example usage:
```tsx
<View style={styles.container}>
  <Text variant="heading">Login</Text>
  <View style={styles.form}>
    <Input
      label="Email"
      value={email}
      onChangeText={setEmail}
      placeholder="Enter your email"
      keyboardType="email-address"
    />
    <Button onPress={handleSubmit}>Login</Button>
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
});
```

### Styling with StyleSheet

Use React Native's StyleSheet API:

```tsx
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

### Theme Colors

Access theme colors using the `useColor` hook:

```tsx
import { useColor } from "@/hooks/useColor";

function MyComponent() {
  const primaryColor = useColor("primary");
  const backgroundColor = useColor("background");
  
  return (
    <View style={{ backgroundColor }}>
      <Text style={{ color: primaryColor }}>Hello</Text>
    </View>
  );
}
```

Available colors (defined in `apps/mobile/theme/colors.ts`):
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `background`, `foreground`
- `muted`, `mutedForeground`
- `card`, `cardForeground`
- `border`, `input`, `ring`
- `red`, `green`, `blue` (color variants)

### Component Props

#### Button
```tsx
<Button
  onPress={handlePress}
  variant="default" // default | secondary | outline | ghost | destructive | success
  size="default" // default | sm | lg | icon
  disabled={false}
  loading={false}
  animation={false} // Disable for Expo Go compatibility
>
  Button Text
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  value={value}
  onChangeText={setValue}
  placeholder="Enter email"
  secureTextEntry={false}
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
/>
```

#### Text
```tsx
<Text variant="heading">Heading</Text>
<Text variant="body">Body text</Text>
<Text variant="link">Link text</Text>
```

### Configuration Files

- **Theme Provider**: `apps/mobile/theme/theme-provider.tsx`
- **Color Definitions**: `apps/mobile/theme/colors.ts`
- **Global Constants**: `apps/mobile/theme/globals.ts`
- **Color Hook**: `apps/mobile/hooks/useColor.ts`

### Common Patterns

```tsx
// Screen layout with header
<View style={styles.container}>
  <View style={styles.header}>
    <Text variant="heading">Screen Title</Text>
    <Button variant="ghost" size="sm" onPress={handleAction}>
      Action
    </Button>
  </View>
  <View style={styles.content}>
    {/* Content */}
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60, // Account for status bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
});

// Form with inputs
<View style={styles.form}>
  <View style={styles.inputGroup}>
    <Input
      label="Name"
      value={name}
      onChangeText={setName}
    />
  </View>
  <Button onPress={handleSubmit} loading={isLoading}>
    Submit
  </Button>
</View>

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
});
```

### Expo Go Compatibility

For Expo Go compatibility, avoid using `react-native-reanimated` directly. Use simple versions:
- Use `SimpleSpinner` instead of animated spinners
- Use `Progress` (simple version) instead of animated progress bars
- Set `animation={false}` on buttons if needed

### Common Mistakes to Avoid

1. ❌ Using inline styles - Use StyleSheet.create() instead
2. ❌ Hard-coded colors - Use `useColor()` hook
3. ❌ Forgetting `animation={false}` on buttons - Can cause Worklets errors in Expo Go
4. ❌ Not accounting for safe area - Use proper padding or SafeAreaView
5. ❌ Using web-specific components - Use React Native equivalents

---

## General Best Practices

### Both Platforms

1. **Consistency**: Keep styling patterns consistent within each platform
2. **Accessibility**: Use proper labels, aria attributes, and accessible colors
3. **Responsive**: Test on multiple screen sizes
4. **Performance**: Avoid expensive computations in render
5. **Dark Mode**: Use theme variables that support dark mode

### Code Organization

```
apps/web/
├── components/ui/          # shadcn/ui components
├── app/
│   └── globals.css        # Theme variables and Tailwind config
└── lib/
    └── utils.ts           # cn() utility for class merging

apps/mobile/
├── components/ui/         # BNA UI components
├── theme/
│   ├── colors.ts         # Color definitions
│   ├── globals.ts        # Global constants
│   └── theme-provider.tsx
└── hooks/
    └── useColor.ts       # Color hook
```

### Resources

- **Web**: [shadcn/ui docs](https://ui.shadcn.com/), [Tailwind CSS docs](https://tailwindcss.com/)
- **Mobile**: [BNA UI docs](https://ui.ahmedbna.com/), [React Native docs](https://reactnative.dev/)
