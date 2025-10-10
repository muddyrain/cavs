import { BlockNoteEditor } from "@cavs/editor-core";
import { ThreadData } from "@cavs/editor-core/comments";
/**
 * Bridges the ThreadStore to React using useSyncExternalStore.
 */
export declare function useThreads(editor: BlockNoteEditor<any, any, any>): Map<string, ThreadData>;
