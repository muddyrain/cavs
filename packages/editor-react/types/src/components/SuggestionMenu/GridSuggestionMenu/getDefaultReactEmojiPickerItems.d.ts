import { BlockNoteEditor, BlockSchema, InlineContentSchema, StyleSchema } from "@cavs/editor-core";
import { DefaultReactGridSuggestionItem } from "./types.js";
export declare function getDefaultReactEmojiPickerItems<BSchema extends BlockSchema, I extends InlineContentSchema, S extends StyleSchema>(editor: BlockNoteEditor<BSchema, I, S>, query: string): Promise<DefaultReactGridSuggestionItem[]>;
