import { FileBlockConfig, audioBlockConfig } from "@cavs/editor-core";
import { ReactCustomBlockRenderProps } from "../../schema/ReactBlockSpec.js";
export declare const AudioPreview: (props: Omit<ReactCustomBlockRenderProps<FileBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const AudioToExternalHTML: (props: Omit<ReactCustomBlockRenderProps<typeof audioBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const AudioBlock: (props: ReactCustomBlockRenderProps<typeof audioBlockConfig, any, any>) => import("react/jsx-runtime").JSX.Element;
export declare const ReactAudioBlock: {
    config: {
        type: "audio";
        propSchema: {
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
        };
        content: "none";
        isFileBlock: true;
        fileBlockAccept: string[];
    };
    implementation: import("@cavs/editor-core").TiptapBlockImplementation<{
        type: "audio";
        propSchema: {
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
        };
        content: "none";
        isFileBlock: true;
        fileBlockAccept: string[];
    }, any, import("@cavs/editor-core").InlineContentSchema, import("@cavs/editor-core").StyleSchema>;
};
