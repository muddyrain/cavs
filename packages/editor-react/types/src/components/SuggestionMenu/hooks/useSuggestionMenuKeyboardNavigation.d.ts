import { BlockNoteEditor } from "@cavs/editor-core";
export declare function useSuggestionMenuKeyboardNavigation<Item>(editor: BlockNoteEditor<any, any, any>, query: string, items: Item[], onItemClick?: (item: Item) => void, element?: HTMLElement): {
    selectedIndex: number | undefined;
};
