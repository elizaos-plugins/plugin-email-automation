import { EmailTemplate, EmailBlock, GeneratedEmailContent } from '../types';
export declare class EmailTemplateManager {
    private templates;
    constructor();
    private registerDefaultTemplates;
    private registerHelpers;
    getTemplate(templateId: string): EmailTemplate;
    registerTemplate(template: EmailTemplate): void;
    private getDefaultTemplate;
    private getNotificationTemplate;
    getDefaultStyles(): string;
    private getNotificationStyles;
    renderEmail(content: GeneratedEmailContent): Promise<string>;
    renderBlock(block: EmailBlock): string;
    private formatBlock;
    private getEmailFormatTemplate;
    private validateTemplate;
}
