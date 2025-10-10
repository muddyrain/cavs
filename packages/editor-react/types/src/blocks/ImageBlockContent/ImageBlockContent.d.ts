import { FileBlockConfig, imageBlockConfig } from "@cavs/editor-core";
import { ReactCustomBlockRenderProps } from "../../schema/ReactBlockSpec.js";
export declare const ImagePreview: (props: Omit<ReactCustomBlockRenderProps<FileBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const ImageToExternalHTML: (props: Omit<ReactCustomBlockRenderProps<typeof imageBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const ImageBlock: (props: ReactCustomBlockRenderProps<typeof imageBlockConfig, any, any>) => import("react/jsx-runtime").JSX.Element;
export declare const ReactImageBlock: {
    config: {
        type: "image";
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
        type: "image";
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
