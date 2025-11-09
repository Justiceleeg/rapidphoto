import { ActivityIndicator } from 'react-native';
import { useColor } from '@/hooks/useColor';

export interface SimpleSpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
}

export function SimpleSpinner({ size = 'small', color }: SimpleSpinnerProps) {
  const defaultColor = useColor('text');
  return <ActivityIndicator size={size} color={color || defaultColor} />;
}

