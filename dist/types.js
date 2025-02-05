import { z } from "zod";
export const SendEmailSchema = z.object({
    from: z.string().email(),
    to: z.union([z.string().email(), z.array(z.string().email())]),
    cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    replyTo: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    subject: z.string(),
    body: z.string(),
    text: z.string().optional(),
    headers: z.record(z.string()).optional(),
    attachments: z.array(z.object({
        filename: z.string(),
        content: z.union([z.instanceof(Buffer), z.string()]),
        path: z.string().optional(),
        contentType: z.string().optional()
    })).optional(),
    tags: z.array(z.object({
        name: z.string(),
        value: z.string()
    })).optional()
});
export const EmailContentSchema = z.object({
    subject: z.string().min(1),
    body: z.string().min(1)
});
export const EmailResponseSchema = z.object({
    analysis: z.object({
        purpose: z.string(),
        tone: z.string(),
        keyPoints: z.array(z.string()),
        urgency: z.string()
    }),
    email: z.object({
        subject: z.string(),
        html: z.string().refine(html => html.endsWith('</p>'), {
            message: 'HTML content must be complete'
        }),
        to: z.array(z.string().email()),
        from: z.string().email(),
        tags: z.array(z.string()).optional()
    })
});
export const EmailMetadataSchema = z.object({
    tone: z.string().describe('The overall tone of the email'),
    intent: z.string().describe('The primary purpose of the email'),
    priority: z.enum(['low', 'medium', 'high']).describe('The priority level of the email'),
    language: z.string().optional().describe('The language to use for the email'),
    theme: z.enum(['light', 'dark', 'custom']).optional().describe('The email theme to use')
});
// Example condition implementations
export class FollowUpCondition {
    evaluate(context) {
        return context.metadata.requiresFollowUp === true;
    }
}
export class InactiveCondition {
    constructor(thresholdHours = 24) {
        this.thresholdHours = thresholdHours;
    }
    evaluate(context) {
        const lastActivity = context.timestamp;
        const hoursSinceActivity = (new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        return hoursSinceActivity >= this.thresholdHours;
    }
}
