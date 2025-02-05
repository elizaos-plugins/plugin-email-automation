export declare class EmailProviderError extends Error {
    provider: string;
    originalError: unknown;
    context?: Record<string, unknown> | undefined;
    constructor(provider: string, originalError: unknown, context?: Record<string, unknown> | undefined);
}
export declare const createEmailProviderError: (provider: string, error: unknown, context?: Record<string, unknown>) => EmailProviderError;
