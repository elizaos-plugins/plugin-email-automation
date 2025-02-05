import type { EmailOptions, EmailProviderResponse } from "../types";
export declare class ResendProvider {
    private client;
    private readonly retryAttempts;
    private readonly retryDelay;
    constructor(apiKey: string);
    sendEmail(options: EmailOptions): Promise<EmailProviderResponse>;
    private shouldRetry;
    private delay;
    validateConfig(): Promise<boolean>;
}
