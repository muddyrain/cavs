import { BlockNoteEditor } from "@cavs/editor-core";
export declare function useGridSuggestionMenuKeyboardNavigation<Item>(editor: BlockNoteEditor<any, any, any>, query: string, items: Item[], columns: number, onItemClick?: (item: Item) => void): {
    selectedIndex: number | undefined;
};
