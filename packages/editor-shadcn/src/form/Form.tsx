import { ComponentProps } from "@cavs/editor-react";
import { assertEmpty } from "@cavs/editor-core";
import { useForm } from "react-hook-form";

import { useShadCNComponentsContext } from "../ShadCNComponentsContext.js";

export const Form = (props: ComponentProps["Generic"]["Form"]["Root"]) => {
  const { children, ...rest } = props;

  assertEmpty(rest);

  const ShadCNComponents = useShadCNComponentsContext()!;

  const form = useForm();

  return (
    <ShadCNComponents.Form.Form {...form}>
      {children}
    </ShadCNComponents.Form.Form>
  );
};
