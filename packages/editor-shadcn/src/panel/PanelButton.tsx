import { ComponentProps } from "@cavs/editor-react";
import { assertEmpty } from "@cavs/editor-core";
import { forwardRef } from "react";

import { useShadCNComponentsContext } from "../ShadCNComponentsContext.js";

export const PanelButton = forwardRef<
  HTMLButtonElement,
  ComponentProps["FilePanel"]["Button"]
>((props, ref) => {
  const { className, children, onClick, label, ...rest } = props;

  assertEmpty(rest);

  const ShadCNComponents = useShadCNComponentsContext()!;

  return (
    <ShadCNComponents.Button.Button
      type={"submit"}
      className={className}
      aria-label={label}
      ref={ref}
      onClick={onClick}
    >
      {children}
    </ShadCNComponents.Button.Button>
  );
});
