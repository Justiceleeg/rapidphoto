import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { BORDER_RADIUS } from "@/theme/globals";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = "default",
  style,
  textStyle,
}: BadgeProps) {
  const backgroundColor = useColor("background");
  const foregroundColor = useColor("foreground");
  const secondaryColor = useColor("secondary");
  const secondaryForegroundColor = useColor("secondaryForeground");
  const destructiveColor = useColor("destructive");
  const destructiveForegroundColor = useColor("destructiveForeground");
  const borderColor = useColor("border");

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: secondaryColor,
          borderColor: borderColor,
          textColor: secondaryForegroundColor,
        };
      case "destructive":
        return {
          backgroundColor: destructiveColor,
          borderColor: "transparent",
          textColor: destructiveForegroundColor,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: borderColor,
          textColor: foregroundColor,
        };
      default:
        return {
          backgroundColor: foregroundColor,
          borderColor: "transparent",
          textColor: backgroundColor,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderWidth: variant === "outline" || variant === "secondary" ? 1 : 0,
        },
        style,
      ]}
    >
      <Text
        variant="caption"
        style={[
          styles.text,
          { color: variantStyles.textColor },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

