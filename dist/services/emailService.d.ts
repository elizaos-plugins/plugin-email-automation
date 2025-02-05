import { EmailTemplateManager } from "./emailTemplateManager";
import { EmailOptions, EmailServiceOptions, EmailProviderResponse, GeneratedEmailContent } from "../types";
export declare class EmailService {
    private secrets;
    private templateManager;
    private provider;
    constructor(secrets: EmailServiceOptions, templateManager?: EmailTemplateManager);
    sendEmail(content: GeneratedEmailContent, options: Omit<EmailOptions, 'subject' | 'body' | 'html'>): Promise<EmailProviderResponse>;
    private generatePlainText;
}
