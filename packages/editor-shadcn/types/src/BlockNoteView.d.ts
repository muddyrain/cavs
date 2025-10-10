import { BlockNoteViewProps } from "@cavs/editor-react";
import { BlockSchema, InlineContentSchema, StyleSchema } from "@cavs/editor-core";
import { ShadCNComponents } from "./ShadCNComponentsContext.js";
export declare const BlockNoteView: <BSchema extends BlockSchema, ISchema extends InlineContentSchema, SSchema extends StyleSchema>(props: BlockNoteViewProps<BSchema, ISchema, SSchema> & {
    /**
     * (optional)Provide your own shadcn component overrides
     */
    shadCNComponents?: Partial<ShadCNComponents>;
}) => import("react/jsx-runtime.js").JSX.Element;
