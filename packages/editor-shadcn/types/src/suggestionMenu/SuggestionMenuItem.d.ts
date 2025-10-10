export declare const SuggestionMenuItem: import("react").ForwardRefExoticComponent<{
    className?: string;
    id: string;
    isSelected: boolean;
    onClick: () => void;
    item: Omit<import("@cavs/editor-react").DefaultReactSuggestionItem, "onItemClick">;
} & import("react").RefAttributes<HTMLDivElement>>;
