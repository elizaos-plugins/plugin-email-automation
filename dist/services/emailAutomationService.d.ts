import { Service, ServiceType, IAgentRuntime, Memory } from "@elizaos/core";
export declare class EmailAutomationService extends Service {
    static get serviceType(): ServiceType;
    get serviceType(): ServiceType;
    private emailService;
    private runtime;
    constructor();
    initialize(runtime: IAgentRuntime): Promise<void>;
    private buildContext;
    evaluateMessage(memory: Memory): Promise<boolean>;
    private shouldSendEmail;
    private handleEmailTrigger;
    private parseFormattedEmail;
    private formatUserIdentifier;
    private detectPlatform;
}
