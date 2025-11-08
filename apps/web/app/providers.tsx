"use client";

import React from "react";
import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { StyleSheet as RNStyleSheet } from "react-native-web";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

function NextTamaguiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = RNStyleSheet.getSheet();
    return (
      <>
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: tamaguiConfig.getNewCSS(),
          }}
        />
      </>
    );
  });

  return (
    <NextThemeProvider skipNextHead defaultTheme="light">
      <TamaguiProvider 
        config={tamaguiConfig} 
        disableRootThemeClass 
        defaultTheme={theme || "light"}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextTamaguiProvider>
        {children}
        <Toaster />
      </NextTamaguiProvider>
    </QueryClientProvider>
  );
}

