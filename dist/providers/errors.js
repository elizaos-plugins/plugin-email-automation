export class EmailProviderError extends Error {
    constructor(provider, originalError, context) {
        super(`Error in ${provider} provider: ${originalError}`);
        this.provider = provider;
        this.originalError = originalError;
        this.context = context;
        this.name = 'EmailProviderError';
    }
}
// Export the factory function
export const createEmailProviderError = (provider, error, context) => new EmailProviderError(provider, error, context);
