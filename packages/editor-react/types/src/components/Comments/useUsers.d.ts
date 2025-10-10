import { BlockNoteEditor } from "@cavs/editor-core";
import { User } from "@cavs/editor-core/comments";
export declare function useUser(editor: BlockNoteEditor<any, any, any>, userId: string): User | undefined;
/**
 * Bridges the UserStore to React using useSyncExternalStore.
 */
export declare function useUsers(editor: BlockNoteEditor<any, any, any>, userIds: string[]): Map<string, User>;
