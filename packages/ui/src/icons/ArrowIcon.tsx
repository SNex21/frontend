import * as React from "react";
import { IconProps } from "./types";
import { primaryColor } from "./utils";


const ArrowIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <path
          d="M8 4L16 12L8 20"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
);

export { ArrowIcon };
