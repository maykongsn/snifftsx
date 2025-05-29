import React from "react";
import { Sector } from "recharts";

type ActiveShapeProps = {
  cx: unknown
  cy: unknown
  cornerRadius: unknown
  innerRadius: number
  outerRadius: number
  startAngle: unknown
  endAngle: unknown
  fill: unknown
}

export const CustomActiveShape = React.memo((props: ActiveShapeProps) => {
  const { cx, cy, cornerRadius, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        cornerRadius={cornerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        cornerRadius={cornerRadius}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
});