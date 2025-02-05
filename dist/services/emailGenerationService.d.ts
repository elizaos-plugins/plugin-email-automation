import { IAgentRuntime } from "@elizaos/core";
import { GeneratedEmailContent, EmailGenerationOptions } from "../types";
export declare class EmailGenerationService {
    private runtime;
    constructor(runtime: IAgentRuntime);
    generateEmail(options: EmailGenerationOptions): Promise<GeneratedEmailContent>;
}
