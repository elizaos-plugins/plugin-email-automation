import { z } from "zod";
import type { IAgentRuntime as CoreAgentRuntime, Memory, State } from "@elizaos/core";
export interface EmailOptions {
    from: string;
    to: string | string[];
    subject: string;
    body: string;
    bcc?: string | string[];
    cc?: string | string[];
    replyTo?: string | string[];
    html?: string;
    text?: string;
    scheduledAt?: string;
    headers?: Record<string, string>;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        path?: string;
        contentType?: string;
    }>;
    tags?: Array<{
        name: string;
        value: string;
    }>;
    template?: string;
    variables?: Record<string, unknown>;
    theme?: 'light' | 'dark' | 'custom';
    style?: Record<string, string>;
}
export type PoweredByOptions = {
    text: string;
    link: string;
} | false;
export declare const SendEmailSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    cc: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    bcc: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    replyTo: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    subject: z.ZodString;
    body: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filename: z.ZodString;
        content: z.ZodUnion<[z.ZodType<Buffer<ArrayBuffer>, z.ZodTypeDef, Buffer<ArrayBuffer>>, z.ZodString]>;
        path: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        filename: string;
        content: string | Buffer<ArrayBuffer>;
        path?: string | undefined;
        contentType?: string | undefined;
    }, {
        filename: string;
        content: string | Buffer<ArrayBuffer>;
        path?: string | undefined;
        contentType?: string | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
    }, {
        value: string;
        name: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[] | undefined;
    bcc?: string | string[] | undefined;
    replyTo?: string | string[] | undefined;
    text?: string | undefined;
    headers?: Record<string, string> | undefined;
    attachments?: {
        filename: string;
        content: string | Buffer<ArrayBuffer>;
        path?: string | undefined;
        contentType?: string | undefined;
    }[] | undefined;
    tags?: {
        value: string;
        name: string;
    }[] | undefined;
}, {
    from: string;
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[] | undefined;
    bcc?: string | string[] | undefined;
    replyTo?: string | string[] | undefined;
    text?: string | undefined;
    headers?: Record<string, string> | undefined;
    attachments?: {
        filename: string;
        content: string | Buffer<ArrayBuffer>;
        path?: string | undefined;
        contentType?: string | undefined;
    }[] | undefined;
    tags?: {
        value: string;
        name: string;
    }[] | undefined;
}>;
export type SendEmailContent = z.infer<typeof SendEmailSchema>;
export interface EmailServiceOptions {
    RESEND_API_KEY: string;
    OWNER_EMAIL?: string;
}
export interface EmailProviderResponse {
    id: string;
    provider: string;
    status: 'success' | 'failed';
    timestamp: Date;
}
export interface IEmailProvider {
    send(params: EmailParams): Promise<EmailProviderResponse>;
    validateConfig(): boolean;
}
export interface EmailParams {
    to: string[];
    from?: string;
    cc?: string[];
    subject: string;
    body: string;
    attachments?: EmailAttachment[];
}
export interface EmailAttachment {
    filename: string;
    content: Buffer;
    contentType: string;
}
export interface ResendConfig {
    apiKey: string;
    defaultFrom?: string;
}
export interface EmailProviderError extends Error {
    provider: string;
    originalError: unknown;
}
export interface EmailConfig {
    poweredBy?: boolean | {
        text?: string;
        link?: string;
    };
}
export declare const EmailContentSchema: z.ZodObject<{
    subject: z.ZodString;
    body: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subject: string;
    body: string;
}, {
    subject: string;
    body: string;
}>;
export type EmailContent = z.infer<typeof EmailContentSchema>;
export declare const EmailResponseSchema: z.ZodObject<{
    analysis: z.ZodObject<{
        purpose: z.ZodString;
        tone: z.ZodString;
        keyPoints: z.ZodArray<z.ZodString, "many">;
        urgency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        tone: string;
        keyPoints: string[];
        urgency: string;
    }, {
        purpose: string;
        tone: string;
        keyPoints: string[];
        urgency: string;
    }>;
    email: z.ZodObject<{
        subject: z.ZodString;
        html: z.ZodEffects<z.ZodString, string, string>;
        to: z.ZodArray<z.ZodString, "many">;
        from: z.ZodString;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        to: string[];
        subject: string;
        html: string;
        tags?: string[] | undefined;
    }, {
        from: string;
        to: string[];
        subject: string;
        html: string;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    analysis: {
        purpose: string;
        tone: string;
        keyPoints: string[];
        urgency: string;
    };
    email: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        tags?: string[] | undefined;
    };
}, {
    analysis: {
        purpose: string;
        tone: string;
        keyPoints: string[];
        urgency: string;
    };
    email: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        tags?: string[] | undefined;
    };
}>;
export interface EmailResponse {
    id: string;
    error?: {
        message: string;
        code: string;
    };
}
export interface EmailBlock {
    type: "paragraph" | "bulletList" | "heading" | "signature" | "callout" | "banner";
    content: string | string[];
    metadata?: {
        style?: string;
        className?: string;
        importance?: "low" | "medium" | "high";
    };
}
export interface GeneratedEmailContent {
    subject: string;
    blocks: EmailBlock[];
    metadata: {
        tone: string;
        intent: string;
        priority: 'low' | 'medium' | 'high';
        language?: string;
    };
}
export interface EmailTemplate {
    id: string;
    name: string;
    html: string;
    variables: string[];
    defaultStyle?: Record<string, string>;
    promptTemplate?: string;
    contextRules?: {
        tone?: string[];
        topics?: string[];
        maxLength?: number;
        customVariables?: Record<string, string>;
    };
}
export interface EmailAutomationConfig {
    templates: {
        followUp?: EmailTemplate;
        reminder?: EmailTemplate;
        engagement?: EmailTemplate;
        [key: string]: EmailTemplate | undefined;
    };
    rules: AutomationRule[];
    promptDefaults?: {
        systemPrompt?: string;
        userPrompt?: string;
        generatePrompt?: (context: EmailContext) => Promise<string>;
    };
}
export interface LLMEmailPrompt {
    content: string;
    format?: 'bullet' | 'paragraph';
    tone?: string;
    language?: string;
    style?: 'casual' | 'formal' | 'technical';
    functionCall: {
        name: 'generateEmail';
        parameters: Record<string, unknown>;
    };
}
export interface EmailPrompt {
    content: string;
    format?: 'bullet' | 'paragraph';
    tone?: 'professional' | 'casual' | 'formal' | 'friendly' | 'urgent';
    language?: string;
    style?: 'casual' | 'formal' | 'technical';
}
export interface EmailGenerationOptions {
    content: string;
    format?: 'bullet' | 'paragraph';
    tone?: 'professional' | 'casual' | 'formal' | 'friendly' | 'urgent';
    language?: string;
    style?: 'casual' | 'formal' | 'technical';
}
export interface GenerateTextOptions {
    context: string;
    modelClass: string;
    tools?: {
        [key: string]: {
            type: "function";
            parameters: unknown;
            description?: string;
        };
    };
}
export type IAgentRuntime = CoreAgentRuntime;
export declare const EmailMetadataSchema: z.ZodObject<{
    tone: z.ZodString;
    intent: z.ZodString;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    language: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodEnum<["light", "dark", "custom"]>>;
}, "strip", z.ZodTypeAny, {
    tone: string;
    intent: string;
    priority: "low" | "medium" | "high";
    language?: string | undefined;
    theme?: "light" | "dark" | "custom" | undefined;
}, {
    tone: string;
    intent: string;
    priority: "low" | "medium" | "high";
    language?: string | undefined;
    theme?: "light" | "dark" | "custom" | undefined;
}>;
export interface AutomationRule {
    id: string;
    name: string;
    trigger: EmailTrigger;
    conditions: EmailCondition[];
    templateId: string;
    cooldown?: number;
}
export interface EmailCondition {
    evaluate(context: EmailContext): boolean;
}
export interface EmailContext {
    memory: Memory;
    state: State;
    metadata: Record<string, unknown>;
    timestamp: Date;
    conversationId: string;
}
export type EmailTrigger = 'follow_up' | 'reminder' | 'engagement' | 'inactive';
export declare class FollowUpCondition implements EmailCondition {
    evaluate(context: EmailContext): boolean;
}
export declare class InactiveCondition implements EmailCondition {
    private readonly thresholdHours;
    constructor(thresholdHours?: number);
    evaluate(context: EmailContext): boolean;
}
export interface EmailPluginConfig {
    defaultToEmail: string;
    defaultFromEmail: string;
    evaluationRules?: {
        maxEmailsPerDay?: number;
        cooldownMinutes?: number;
        blacklistedDomains?: string[];
    };
    templates?: {
        shouldEmailPrompt?: string;
        connectionEmailTemplate?: string;
    };
}
export interface EmailTriggerContext extends EmailContext {
    recentInteractions: {
        lastEmailSent?: Date;
        emailCount24h: number;
        conversationActivity: {
            lastMessage: Date;
            messageCount: number;
        };
    };
    userPreferences?: {
        emailFrequency?: 'low' | 'medium' | 'high';
        timezone?: string;
        preferredTimes?: string[];
    };
}
