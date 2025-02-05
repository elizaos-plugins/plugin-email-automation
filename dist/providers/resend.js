import { Resend } from "resend";
import { elizaLogger } from "@elizaos/core";
import { createEmailProviderError } from './errors';
export class ResendProvider {
    constructor(apiKey) {
        this.retryAttempts = 3;
        this.retryDelay = 1000; // ms
        this.client = new Resend(apiKey);
    }
    async sendEmail(options) {
        let lastError = null;
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.client.emails.send({
                    from: options.from,
                    to: options.to,
                    subject: options.subject,
                    html: options.html || options.body,
                    text: options.text,
                    bcc: options.bcc,
                    cc: options.cc,
                    reply_to: options.replyTo,
                    headers: options.headers,
                    attachments: options.attachments,
                    tags: options.tags
                });
                if (!response.data?.id) {
                    throw new Error('Missing response data from Resend');
                }
                elizaLogger.debug('Email sent successfully', {
                    id: response.data.id,
                    attempt
                });
                return {
                    id: response.data.id,
                    provider: 'resend',
                    status: 'success',
                    timestamp: new Date()
                };
            }
            catch (error) {
                lastError = error;
                elizaLogger.error(`Resend attempt ${attempt} failed:`, {
                    error,
                    options: {
                        to: options.to,
                        subject: options.subject
                    }
                });
                if (this.shouldRetry(error) && attempt < this.retryAttempts) {
                    await this.delay(attempt * this.retryDelay);
                    continue;
                }
                break;
            }
        }
        throw createEmailProviderError('resend', lastError, {
            attempts: this.retryAttempts,
            lastAttemptAt: new Date().toISOString()
        });
    }
    shouldRetry(error) {
        if (error instanceof Error) {
            // Retry on network errors or rate limits
            return error.message.includes('network') ||
                error.message.includes('rate limit') ||
                error.message.includes('timeout');
        }
        return false;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async validateConfig() {
        try {
            // Try to get account info or similar lightweight call
            await this.client.emails.send({
                from: 'test@resend.dev',
                to: 'validate@resend.dev',
                subject: 'Configuration Test',
                text: 'Testing configuration'
            });
            return true;
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes('unauthorized')) {
                return false;
            }
            // Other errors might indicate valid config but other issues
            return true;
        }
    }
}
