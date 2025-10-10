import { DefaultInlineContentSchema, DefaultStyleSchema, InlineContentSchema, StyleSchema } from "@cavs/editor-core";
import { FC } from "react";
import { ExtendButtonProps } from "./ExtendButton/ExtendButtonProps.js";
import { TableCellButtonProps } from "./TableCellButtonProps.js";
import { TableHandleProps } from "./TableHandleProps.js";
export declare const TableHandlesController: <I extends InlineContentSchema = DefaultInlineContentSchema, S extends StyleSchema = DefaultStyleSchema>(props: {
    tableCellHandle?: FC<TableCellButtonProps<I, S>>;
    tableHandle?: FC<TableHandleProps<I, S>>;
    extendButton?: FC<ExtendButtonProps<I, S>>;
}) => import("react/jsx-runtime").JSX.Element | null;
