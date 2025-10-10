import { fileBlockConfig } from "@cavs/editor-core";
import { ReactCustomBlockRenderProps } from "../../schema/ReactBlockSpec.js";
export declare const FileToExternalHTML: (props: Omit<ReactCustomBlockRenderProps<typeof fileBlockConfig, any, any>, "contentRef">) => import("react/jsx-runtime").JSX.Element;
export declare const FileBlock: (props: ReactCustomBlockRenderProps<typeof fileBlockConfig, any, any>) => import("react/jsx-runtime").JSX.Element;
export declare const ReactFileBlock: {
    config: {
        type: "file";
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
        };
        content: "none";
        isFileBlock: true;
    };
    implementation: import("@cavs/editor-core").TiptapBlockImplementation<{
        type: "file";
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
        };
        content: "none";
        isFileBlock: true;
    }, any, import("@cavs/editor-core").InlineContentSchema, import("@cavs/editor-core").StyleSchema>;
};
