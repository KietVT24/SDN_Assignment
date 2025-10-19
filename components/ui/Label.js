import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Unified Label component
 *
 * - ForwardRef-compatible
 * - Supports `htmlFor`, `children`, `className`, and other label props
 * - Exports both named and default for maximum compatibility
 */
const Label = React.forwardRef(({ className = "", htmlFor, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        // combined sensible defaults from both versions
        "block mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export { Label };
export default Label;


// import * as React from "react"
// import { cn } from "@/lib/utils"

// const Label = React.forwardRef(({ className, ...props }, ref) => (
//   <label
//     ref={ref}
//     className={cn(
//       "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
//       className
//     )}
//     {...props}
//   />
// ))
// Label.displayName = "Label"

// export { Label }
