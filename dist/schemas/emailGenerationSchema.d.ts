import { z } from "zod";
export declare const EmailBlockTypeEnum: z.ZodEnum<["paragraph", "bulletList", "heading", "callout", "signature", "banner"]>;
export declare const EmailMetadataSchema: z.ZodObject<{
    tone: z.ZodString;
    intent: z.ZodString;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    language: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tone: string;
    intent: string;
    priority: "low" | "medium" | "high";
    language?: string | undefined;
}, {
    tone: string;
    intent: string;
    priority: "low" | "medium" | "high";
    language?: string | undefined;
}>;
export declare const EmailBlockSchema: z.ZodObject<{
    type: z.ZodEnum<["paragraph", "bulletList", "heading", "callout", "signature", "banner"]>;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    metadata: z.ZodOptional<z.ZodObject<{
        style: z.ZodOptional<z.ZodString>;
        className: z.ZodOptional<z.ZodString>;
        importance: z.ZodOptional<z.ZodEnum<["high", "medium", "low"]>>;
    }, "strip", z.ZodTypeAny, {
        style?: string | undefined;
        className?: string | undefined;
        importance?: "low" | "medium" | "high" | undefined;
    }, {
        style?: string | undefined;
        className?: string | undefined;
        importance?: "low" | "medium" | "high" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
    content: string | string[];
    metadata?: {
        style?: string | undefined;
        className?: string | undefined;
        importance?: "low" | "medium" | "high" | undefined;
    } | undefined;
}, {
    type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
    content: string | string[];
    metadata?: {
        style?: string | undefined;
        className?: string | undefined;
        importance?: "low" | "medium" | "high" | undefined;
    } | undefined;
}>;
export declare const EmailPromptSchema: z.ZodObject<{
    content: z.ZodString;
    format: z.ZodOptional<z.ZodEnum<["bullet", "paragraph"]>>;
    tone: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string;
    tone?: string | undefined;
    language?: string | undefined;
    format?: "paragraph" | "bullet" | undefined;
    style?: string | undefined;
}, {
    content: string;
    tone?: string | undefined;
    language?: string | undefined;
    format?: "paragraph" | "bullet" | undefined;
    style?: string | undefined;
}>;
export declare const EmailGenerationSchema: z.ZodObject<{
    name: z.ZodLiteral<"generateEmail">;
    parameters: z.ZodObject<{
        subject: z.ZodString;
        blocks: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["paragraph", "bulletList", "heading", "callout", "signature", "banner"]>;
            content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
            metadata: z.ZodOptional<z.ZodObject<{
                style: z.ZodOptional<z.ZodString>;
                className: z.ZodOptional<z.ZodString>;
                importance: z.ZodOptional<z.ZodEnum<["high", "medium", "low"]>>;
            }, "strip", z.ZodTypeAny, {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            }, {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }, {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }>, "many">;
        metadata: z.ZodObject<{
            tone: z.ZodString;
            intent: z.ZodString;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            language: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        }, {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        subject: string;
        blocks: {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }[];
        metadata: {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        };
    }, {
        subject: string;
        blocks: {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }[];
        metadata: {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    name: "generateEmail";
    parameters: {
        subject: string;
        blocks: {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }[];
        metadata: {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        };
    };
}, {
    name: "generateEmail";
    parameters: {
        subject: string;
        blocks: {
            type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
            content: string | string[];
            metadata?: {
                style?: string | undefined;
                className?: string | undefined;
                importance?: "low" | "medium" | "high" | undefined;
            } | undefined;
        }[];
        metadata: {
            tone: string;
            intent: string;
            priority: "low" | "medium" | "high";
            language?: string | undefined;
        };
    };
}>;
export declare const formatBlock: (block: EmailBlock) => string;
export type EmailBlock = z.infer<typeof EmailBlockSchema>;
export type EmailMetadata = z.infer<typeof EmailMetadataSchema>;
export type EmailGeneration = z.infer<typeof EmailGenerationSchema>;
export type EmailPrompt = z.infer<typeof EmailPromptSchema>;
