import { DefaultInlineContentSchema, DefaultStyleSchema, InlineContentSchema, StyleSchema } from "@cavs/editor-core";
import { ReactNode } from "react";
import { TableCellMenuProps } from "../TableCellMenuProps.js";
export declare const ColorPickerButton: <I extends InlineContentSchema = DefaultInlineContentSchema, S extends StyleSchema = DefaultStyleSchema>(props: TableCellMenuProps<I, S> & {
    children?: ReactNode;
}) => import("react/jsx-runtime").JSX.Element | null;
