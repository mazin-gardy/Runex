import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type HomeRouteIconProps = {
  color?: string;
  size?: number;
};

export default function HomeRouteIcon({
  color = "#1f1111",
  size = 30,
}: HomeRouteIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Route line */}
      <Path
        d="M28 68 C28 50, 46 54, 50 46 C56 34, 35 32, 38 18"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom left point */}
      <Circle cx="28" cy="70" r="10" fill={color} />

      {/* Top right ring */}
      <Circle
        cx="46"
        cy="20"
        r="5"
        stroke={color}
        strokeWidth={10}
        fill="none"
      />
    </Svg>
  );
}