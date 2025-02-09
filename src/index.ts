import { EmailAutomationService } from "./services/emailAutomationService";

const emailAutomationPlugin = {
    name: "email-automation",
    description: "AI-powered email automation plugin for Eliza",
    services: [new EmailAutomationService() as any],
    clients: [],
    evaluators: [],
    providers: [],
};

export default emailAutomationPlugin;
