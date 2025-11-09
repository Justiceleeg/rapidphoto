import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { HEIGHT } from '@/theme/globals';
import React from 'react';
import { ViewStyle } from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
  height?: number;
}

export function Progress({
  value,
  style,
  height = HEIGHT,
}: ProgressProps) {
  const primaryColor = useColor('primary');
  const mutedColor = useColor('muted');

  const clampedValue = Math.max(0, Math.min(100, value));

  const containerStyle: ViewStyle = {
    height: height,
    width: '100%',
    backgroundColor: mutedColor,
    borderRadius: height / 2,
    overflow: 'hidden',
    ...style,
  };

  const progressStyle: ViewStyle = {
    height: '100%',
    width: `${clampedValue}%`,
    backgroundColor: primaryColor,
    borderRadius: height / 2,
  };

  return (
    <View style={containerStyle}>
      <View style={progressStyle} />
    </View>
  );
}

