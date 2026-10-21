import type { CSSProperties, JSX } from "react";

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  pattern?: "grid" | "hex" | "spiral" | "scatter";
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  cursorRadius?: number;
  bulgeStrength?: number;
  twist?: number;
  glowColor?: string;
  glowRadius?: number;
  glowIntensity?: number;
  baseOpacity?: number;
  waveAmplitude?: number;
  sparkle?: boolean;
  speed?: number;
  interactive?: boolean;
  holdToZoom?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  opacity?: number;
  maxDevicePixelRatio?: number;
  className?: string;
  style?: CSSProperties;
}

declare const DotField: (props: DotFieldProps) => JSX.Element;
export default DotField;
