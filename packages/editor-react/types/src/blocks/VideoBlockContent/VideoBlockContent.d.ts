import { FileBlockConfig, videoBlockConfig } from "@cavs/editor-core";
import { ReactCustomBlockRenderProps } from "../../schema/ReactBlockSpec.js";
export declare const VideoPreview: (props: Omit<ReactCustomBlockRenderProps<FileBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const VideoToExternalHTML: (props: Omit<ReactCustomBlockRenderProps<typeof videoBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const VideoBlock: (props: ReactCustomBlockRenderProps<typeof videoBlockConfig, any, any>) => import("react/jsx-runtime").JSX.Element;
export declare const ReactVideoBlock: {
    config: {
        type: "video";
        propSchema: {
            textAlignment: {
                default: "left";
                values: readonly ["left", "center", "right", "justify"];
            };
            backgroundColor: {
                default: "default";
            };
            name: {
                default: "";
            };
            url: {
                default: "";
            };
            caption: {
                default: "";
            };
            showPreview: {
                default: true;
            };
            previewWidth: {
                default: undefined;
                type: "number";
            };
        };
        content: "none";
        isFileBlock: true;
        fileBlockAccept: string[];
    };
    implementation: import("@cavs/editor-core").TiptapBlockImplementation<{
        type: "video";
        propSchema: {
            textAlignment: {
                default: "left";
                values: readonly ["left", "center", "right", "justify"];
            };
            backgroundColor: {
                default: "default";
            };
            name: {
                default: "";
            };
            url: {
                default: "";
            };
            caption: {
                default: "";
            };
            showPreview: {
                default: true;
            };
            previewWidth: {
                default: undefined;
                type: "number";
            };
        };
        content: "none";
        isFileBlock: true;
        fileBlockAccept: string[];
    }, any, import("@cavs/editor-core").InlineContentSchema, import("@cavs/editor-core").StyleSchema>;
};
