import { BlockNoteSchema } from "@cavs/editor-core";
export declare const schema: BlockNoteSchema<import("@cavs/editor-core").BlockSchemaFromSpecs<{
    paragraph: {
        config: {
            type: "paragraph";
            content: "inline";
            propSchema: {};
        };
        implementation: import("@cavs/editor-core").TiptapBlockImplementation<{
            type: "paragraph";
            content: "inline";
            propSchema: {};
        }, any, import("@cavs/editor-core").InlineContentSchema, import("@cavs/editor-core").StyleSchema>;
    };
}>, import("@cavs/editor-core").InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}>, import("@cavs/editor-core").StyleSchemaFromSpecs<{
    bold: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@cavs/editor-core").StyleImplementation;
    };
    italic: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@cavs/editor-core").StyleImplementation;
    };
    underline: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@cavs/editor-core").StyleImplementation;
    };
    strike: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@cavs/editor-core").StyleImplementation;
    };
    code: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@cavs/editor-core").StyleImplementation;
    };
}>>;
