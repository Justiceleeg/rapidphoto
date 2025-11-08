# React Native with Expo - Setup Guide

This guide will walk you through setting up React Native development with Expo for the first time.

## Prerequisites

### 1. Node.js and pnpm
You should already have these set up:
- **Node.js**: v20+ (check with `node --version`)
- **pnpm**: v10.14.0 (check with `pnpm --version`)

If you need to install pnpm:
```bash
npm install -g pnpm@10.14.0
```

### 2. Choose Your Development Platform

You have three options for running your React Native app:

#### Option A: iOS Simulator (macOS only)
- **Requires**: macOS and Xcode
- **Best for**: iOS development and testing
- **Setup**: Install Xcode from the Mac App Store (it's free but large ~10GB+)

#### Option B: Android Emulator (macOS, Windows, Linux)
- **Requires**: Android Studio
- **Best for**: Android development and testing
- **Setup**: Install Android Studio and configure an emulator

#### Option C: Physical Device (Recommended for beginners)
- **Requires**: Expo Go app on your phone
- **Best for**: Quick testing, no setup needed
- **Setup**: Install Expo Go from App Store (iOS) or Play Store (Android)

**Recommendation**: Start with Option C (physical device) - it's the fastest way to get started!

## Step-by-Step Setup

### Step 1: Install Expo CLI (globally)

```bash
npm install -g expo-cli
```

Or use npx (no global install needed):
```bash
npx expo@latest --version
```

### Step 2: Install iOS Simulator (macOS only, optional)

If you want to use the iOS Simulator:

1. **Install Xcode**:
   - Open Mac App Store
   - Search for "Xcode"
   - Click "Get" or "Install" (this will take a while, ~10GB+)

2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

3. **Accept Xcode License**:
   ```bash
   sudo xcodebuild -license accept
   ```

4. **Install iOS Simulator**:
   - Open Xcode
   - Go to Xcode → Settings → Platforms
   - Install the latest iOS Simulator

### Step 3: Install Android Studio (optional)

If you want to use the Android Emulator:

1. **Download Android Studio**:
   - Visit https://developer.android.com/studio
   - Download for your OS
   - Install following the wizard

2. **Configure Android Emulator**:
   - Open Android Studio
   - Go to Tools → Device Manager
   - Click "Create Device"
   - Select a device (e.g., Pixel 5)
   - Select a system image (e.g., Android 13)
   - Finish the setup

3. **Add Android to PATH** (macOS/Linux):
   Add to your `~/.zshrc` or `~/.bashrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```
   Then reload: `source ~/.zshrc` (or `source ~/.bashrc`)

### Step 4: Initialize Expo Project in Monorepo

Once we create the mobile app, you'll initialize it like this:

```bash
# From the project root
cd apps
npx create-expo-app@latest mobile --template blank-typescript
```

**Important**: We'll need to configure it for the monorepo structure after initialization.

### Step 5: Install Expo Go on Your Phone (Easiest Option)

1. **iOS**: Open App Store → Search "Expo Go" → Install
2. **Android**: Open Play Store → Search "Expo Go" → Install

This app lets you run your React Native app on your phone without any emulator setup!

## Running Your App

Once the mobile app is set up, you'll run it like this:

### Using Physical Device (Easiest)

1. **Start the development server**:
   ```bash
   pnpm dev:mobile
   # or from apps/mobile:
   cd apps/mobile
   pnpm start
   ```

2. **Scan QR Code**:
   - A QR code will appear in your terminal
   - **iOS**: Open Camera app → Point at QR code → Tap notification
   - **Android**: Open Expo Go app → Tap "Scan QR code"

3. **Your app loads on your phone!**

### Using iOS Simulator (macOS)

```bash
cd apps/mobile
pnpm start
# Then press 'i' to open iOS simulator
```

### Using Android Emulator

1. **Start Android Emulator**:
   - Open Android Studio
   - Go to Tools → Device Manager
   - Click the play button next to your emulator

2. **Start Expo**:
   ```bash
   cd apps/mobile
   pnpm start
   # Then press 'a' to open Android emulator
   ```

## Development Workflow

### Hot Reload
- Changes to your code automatically refresh on your device/emulator
- No need to restart the app!

### Debugging
- **Console logs**: Appear in your terminal where you ran `pnpm start`
- **React DevTools**: Can be installed for component inspection
- **Network requests**: Visible in terminal logs

### Common Commands

```bash
# Start development server
pnpm dev:mobile

# Start with specific platform
cd apps/mobile
pnpm start --ios      # iOS simulator
pnpm start --android  # Android emulator
pnpm start --web      # Web browser (yes, Expo supports web!)

# Clear cache if things break
cd apps/mobile
pnpm start --clear
```

## Troubleshooting

### "Expo CLI not found"
```bash
npm install -g expo-cli
# or use npx expo@latest instead
```

### "Cannot connect to Metro bundler"
- Make sure your phone and computer are on the same WiFi network
- Try restarting the development server
- For physical devices, try using the tunnel option: `pnpm start --tunnel`

### "iOS Simulator won't open"
- Make sure Xcode is installed and license is accepted
- Try: `sudo xcodebuild -license accept`
- Restart your terminal

### "Android Emulator is slow"
- This is normal! Emulators are resource-intensive
- Consider using a physical device for faster development
- Or use Android Studio's "Cold Boot" option for better performance

### "Port already in use"
```bash
# Find what's using the port (usually 8081)
lsof -ti:8081 | xargs kill -9
```

## Next Steps

After setting up your development environment:

1. ✅ Install Expo CLI (or use npx)
2. ✅ Choose your development platform (physical device recommended)
3. ✅ Install Expo Go app on your phone (if using physical device)
4. ✅ Install Xcode (if using iOS Simulator - macOS only)
5. ✅ Install Android Studio (if using Android Emulator)

Once these are done, we can proceed with initializing the Expo project in the monorepo!

## Key Differences from Web Development

1. **No Browser DevTools**: Use React Native Debugger or Flipper instead
2. **Platform-Specific Code**: You can write iOS/Android specific code
3. **Native Modules**: Some features require native code (Expo handles most of this)
4. **File System**: Limited access to device file system
5. **Styling**: Uses a subset of CSS (Flexbox-based, no CSS Grid)

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Styling Guide](https://reactnative.dev/docs/style)

