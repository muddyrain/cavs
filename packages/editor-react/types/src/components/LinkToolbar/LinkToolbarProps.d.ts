import { BlockNoteEditor, BlockSchema, InlineContentSchema, LinkToolbarState, StyleSchema, UiElementPosition } from "@cavs/editor-core";
export type LinkToolbarProps = Omit<LinkToolbarState, keyof UiElementPosition> & Pick<BlockNoteEditor<BlockSchema, InlineContentSchema, StyleSchema>["linkToolbar"], "deleteLink" | "editLink" | "startHideTimer" | "stopHideTimer">;
