// src/services/emailAutomationService.ts
import { Service, ServiceType, elizaLogger as elizaLogger3, ModelClass, generateText, composeContext } from "@elizaos/core";

// src/services/emailService.ts
import { elizaLogger as elizaLogger2 } from "@elizaos/core";

// src/services/emailTemplateManager.ts
import Handlebars from "handlebars";

// src/templates/emailFormat.ts
var emailFormatTemplate = `
<context>
# Conversation Details
User ID: {{memory.userId}}
Name: {{memory.senderName}}
Bio: {{memory.bio}}
Recent Messages: {{previousMessages}}
</context>

<evaluation_steps>
1. Extract Key Quotes:
\u2022 Pull exact phrases about role/company
\u2022 Identify specific technical claims
\u2022 Note any metrics or numbers
\u2022 Capture stated intentions

2. Extract Core Information:
\u2022 Professional context
\u2022 Technical details
\u2022 Project specifics
\u2022 Team background

3. Organize Key Points:
\u2022 Identify main value propositions
\u2022 Extract concrete metrics/details
\u2022 Note specific technical requirements
\u2022 Highlight relevant experience

4. Plan Next Steps:
\u2022 Consider conversation stage
\u2022 Identify information gaps
\u2022 Determine appropriate follow-up
\u2022 Set clear action items
</evaluation_steps>

<instructions>
First, extract the most relevant quotes from the conversation that should be included in the email. Put them in <relevant_quotes> tags.

Then, format an email summary using EXACTLY this format:

<email_format>
Subject: [Clear, specific title with role/company]

Background:
[2-3 sentences about who they are and relevant context, based on extracted quotes]

Key Points:
\u2022 [3-5 bullet points about their main interests/proposals, supported by quotes]

Technical Details:
\u2022 [Technical detail 1 if available]
\u2022 [Technical detail 2 if available]

Next Steps:
1. [First action item]
2. [Second action item]
</email_format>
Output the email in this exact format, omitting sections if insufficient information exists. Only include information that can be supported by the extracted quotes.
</instructions>

<final_thought>
Remember: Be concise and factual. Focus on actionable information over general statements. Do not include details that aren't supported by extracted quotes.
</final_thought>
`;

// src/services/emailTemplateManager.ts
var EmailTemplateManager = class {
  constructor() {
    this.templates = /* @__PURE__ */ new Map();
    this.registerDefaultTemplates();
    this.registerHelpers();
    Handlebars.registerHelper("formatBlock", (block) => {
      return new Handlebars.SafeString(this.formatBlock(block));
    });
  }
  registerDefaultTemplates() {
    this.templates.set("default", {
      id: "default",
      name: "Default Template",
      html: this.getDefaultTemplate(),
      variables: ["subject", "blocks", "signature"],
      defaultStyle: {
        container: this.getDefaultStyles(),
        notification: ""
      }
    });
    this.templates.set("notification", {
      id: "notification",
      name: "Notification Template",
      html: this.getNotificationTemplate(),
      variables: ["subject", "blocks", "signature", "priority"],
      defaultStyle: {
        container: this.getDefaultStyles(),
        notification: this.getNotificationStyles()
      }
    });
    this.templates.set("format", {
      id: "format",
      name: "Email Format Template",
      html: this.getEmailFormatTemplate(),
      variables: ["memory", "previousMessages"],
      defaultStyle: {
        container: this.getDefaultStyles(),
        notification: ""
      }
    });
  }
  registerHelpers() {
    Handlebars.registerHelper("eq", function(arg1, arg2) {
      return arg1 === arg2;
    });
    Handlebars.registerHelper("formatBlock", (block) => {
      switch (block.type) {
        case "paragraph":
          return new Handlebars.SafeString(
            `<p class="email-paragraph ${block.metadata?.className || ""}"
                            style="${block.metadata?.style || ""}">${block.content}</p>`
          );
        case "bulletList":
          return new Handlebars.SafeString(
            `<ul class="email-list ${block.metadata?.className || ""}"
                            style="${block.metadata?.style || ""}">
                            ${Array.isArray(block.content) ? block.content.map((item) => `<li class="email-list-item">${item}</li>`).join("") : `<li class="email-list-item">${block.content}</li>`}
                        </ul>`
          );
        case "heading":
          return new Handlebars.SafeString(
            `<h2 class="email-heading ${block.metadata?.className || ""}"
                            style="${block.metadata?.style || ""}">${block.content}</h2>`
          );
        case "signature":
          return new Handlebars.SafeString(
            `<div class="email-signature">${block.content}</div>`
          );
        case "callout":
          return new Handlebars.SafeString(
            `<div class="email-callout ${block.metadata?.className || ""}"
                            style="${block.metadata?.style || ""}">${block.content}</div>`
          );
        default:
          return block.content;
      }
    });
    Handlebars.registerHelper("priorityBadge", (priority) => {
      const colors = {
        high: "#dc3545",
        medium: "#ffc107",
        low: "#28a745"
      };
      return new Handlebars.SafeString(
        `<div class="priority-badge"
                    style="background-color: ${colors[priority]}">
                    ${priority.toUpperCase()}
                </div>`
      );
    });
    Handlebars.registerHelper("currentYear", function() {
      return (/* @__PURE__ */ new Date()).getFullYear();
    });
  }
  getTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) {
      return this.templates.get("default");
    }
    return template;
  }
  registerTemplate(template) {
    this.validateTemplate(template);
    this.templates.set(template.id, template);
  }
  getDefaultTemplate() {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>{{subject}}</title>
                    <style>
                        {{{defaultStyle}}}
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="banner" style="
                            background-color: #f8f9fa;
                            padding: 12px;
                            text-align: center;
                            border-bottom: 1px solid #e9ecef;
                        ">
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                                color: #6c757d;
                                font-size: 13px;
                            ">
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMGSURBVFiF7ZdNiFZVGMd/z7lvM42WYR8GZkIxFhFR0SaIIYKoFrWQClpUq4jIjRAtWkWLNkEtoke3LiIiEmoVFBW0KKgQIgxCsKgPqEbMJnScyY9m3vt/WtxzZ+68H3PvO4vEH1zOc59zzvM/z3Oe8zznXuv1eqaqqmeBy4ClwGXApcB8YB4wC+gBCmAM+Bv4DTgGHAEOA4eAn4HjwIRz7lSz2SyMMTNZa7uAjcBDwB3A7LbhE8BPwEHgG2Af8BVwyvf9KedcL4Ax5gygH7gXWA/cBMw5g4EW8D3wMfAR8I1zbqIoCq8sy24gAh4G1gGzz9LwdOSBz4G3gY+dc+PGmPnAvcDjwMozjP0H+ALYB+wGDgHHgFNAE6iBi4ErgGuAQWAlsKhj/jjwLvC6c+5PY0wPMAQ8CawBvG7GgO+AncBOY8xeYMJaW5dlmTfGzAZuBe4H7gYub5s7CmwD3nLOjRpj5gKPAE8By9rm/QXsALYbY/YAjTzPTdd13XVd13med4Ux5lHgAWBh29yvgNeAHc65MQBjzELgceBp4MK2ed8C24wxO40xR+u6bvi+71dVVRRFUQRBEBhjFhtjHgQeBZYBPnAS2A1sNcZ86ZzLjTEXAE8AzwAXt637KLAd2GaM+b0oCr+u6zzP86ooikZZlkEQBHPSNN0ErAUuAQLgb+BzYKsx5rM0TcuttQ8BzwOL29b7AdgKvJ+m6bEkSYKqqvI8z6uyLJtlWQZ1XTfSNL0OeBFYDVyQJv8L/Ai8A7yXJMnBOI5XAy8AK9rW+RN4B3grSZL9URTNqaoqz/O8KsuylabpnLquG1VVNcqybBRFERRF4fu+PwDcDNwOrAKWkO6AY8CPwF5gD/CVtfZEkiRrgOeBwbb1jwPvA28mSfJ1FEWzgQZAXddlURRBXdeNoigC3/d9z/M8Y0xXmqaLgaVpmi5N03RxmqYL0jSdl6bprDRNZ6ZpGqRp6qdp6qVpijFm0hhzMk3TkTRNj6Vp+keapofTND2QpumPxpijxpimMcY45wqALMv+A2qXz6gxuUEjAAAAAElFTkSuQmCC"
                                    alt="ElizaOS"
                                    style="width: 14px; height: 14px;"
                                >
                                Powered by ElizaOS
                            </div>
                        </div>
                        <div class="content">
                            <h1>{{subject}}</h1>
                            {{#each blocks}}
                                {{{formatBlock this}}}
                            {{/each}}
                        </div>
                    </div>
                </body>
            </html>
        `.trim();
  }
  getNotificationTemplate() {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>{{{defaultStyle}}}</style>
                </head>
                <body>
                    <div class="email-container notification">
                        <div class="notification-header">
                            <h1 class="email-subject">{{subject}}</h1>
                            {{#if metadata.showPriority}}
                                {{#if metadata.priority}}
                                    {{priorityBadge metadata.priority}}
                                {{/if}}
                            {{/if}}
                        </div>
                        {{#each blocks}}
                            {{formatBlock this}}
                        {{/each}}
                        {{#if signature}}
                            <div class="email-signature">{{{signature}}}</div>
                        {{/if}}
                        <div class="footer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Powered by ElizaOS
                        </div>
                    </div>
                </body>
            </html>
        `;
  }
  getDefaultStyles() {
    return `
            /* Reset styles */
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f6f9fc;
            }

            /* Container */
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }

            /* Header */
            .header {
                text-align: center;
                padding: 24px;
                background-color: #f8f9fa;
            }

            .logo {
                height: 12px;
                width: 12px;
                margin: 12px;
                object-fit: contain;
            }

            /* Content */
            .content {
                padding: 32px 24px;
                background-color: #ffffff;
            }

            /* Typography */
            h1 {
                color: #2c3e50;
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #eaeaea;
            }

            .email-paragraph {
                margin: 0 0 20px;
                color: #2c3e50;
            }

            .email-list {
                margin: 20px 0;
                padding-left: 20px;
            }

            .email-list-item {
                margin: 8px 0;
            }

            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eaeaea;
                font-style: italic;
                color: #666;
            }

            /* Footer */
            .footer-divider {
                height: 1px;
                background-color: #eaeaea;
                margin: 0;
            }

            .footer {
                padding: 16px;
                text-align: center;
                background-color: #f8f9fa;
                color: #6b7280;
            }

            .footer-text {
                font-size: 14px;
                display: block;
                margin-bottom: 8px;
            }

            .copyright {
                font-size: 12px;
                color: #9ca3af;
            }

            .powered-by {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 12px 0;
            }

            .eliza-icon {
                opacity: 0.8;
            }

            .footer-links {
                margin-top: 12px;
            }

            .footer-links a {
                color: #666666;
                text-decoration: none;
                transition: color 0.15s ease;
            }

            .footer-links a:hover {
                color: #333333;
            }

            /* Responsive */
            @media only screen and (max-width: 640px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }

                .content {
                    padding: 24px 20px;
                }
            }

            .powered-link {
                color: #6b7280;
                text-decoration: none;
                transition: color 0.15s ease;
            }

            .powered-link:hover {
                color: #374151;
            }

            .default-logo {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 16px 0;
                background: #f8f9fa;
            }

            .default-logo svg {
                height: 48px;
                width: 48px;
                color: #2c3e50;
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .default-logo svg {
                    color: #f8f9fa;
                }
            }

            .copyright {
                text-align: center;
                padding: 16px;
                color: #6b7280;
                font-size: 12px;
                border-top: 1px solid #eaeaea;
            }

            .footer {
                text-align: center;
                padding: 12px;
                background-color: #f8f9fa;
                color: #6b7280;
                font-size: 13px;
                border-top: 1px solid #eaeaea;
            }

            .paragraph {
                color: #374151;
                margin: 16px 0;
                line-height: 1.6;
            }

            .bullet-list {
                margin: 16px 0;
                padding-left: 24px;
            }

            .bullet-list li {
                color: #374151;
                margin: 8px 0;
                line-height: 1.5;
            }

            .heading {
                color: #111827;
                font-size: 20px;
                font-weight: 600;
                margin: 24px 0 16px 0;
            }

            .signature {
                margin: 32px 0 24px;
                color: #4B5563;
                font-style: italic;
            }
        `.trim();
  }
  getNotificationStyles() {
    return `
            ${this.getDefaultStyles()}
            .notification {
                border: 1px solid #e1e4e8;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
            }
            .priority-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                color: white;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .notification .email-paragraph {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 4px;
                margin: 12px 0;
            }
            .notification .email-list {
                background: #f8f9fa;
                padding: 16px 16px 16px 36px;
                border-radius: 4px;
                margin: 12px 0;
            }
        `;
  }
  async renderEmail(content) {
    try {
      const template = this.getTemplate(content.metadata.priority === "high" ? "notification" : "default");
      const compiledTemplate = Handlebars.compile(template.html);
      const rendered = compiledTemplate({
        subject: content.subject,
        blocks: content.blocks,
        metadata: content.metadata,
        defaultStyle: this.getDefaultStyles()
      });
      return rendered;
    } catch (error) {
      console.error("Template rendering error:", error);
      throw error;
    }
  }
  renderBlock(block) {
    switch (block.type) {
      case "paragraph":
        return `<p class="email-paragraph">${block.content}</p>`;
      case "bulletList":
        const items = Array.isArray(block.content) ? block.content : [block.content];
        return `
                    <ul class="email-list">
                        ${items.map((item) => `<li>${item}</li>`).join("\n")}
                    </ul>
                `;
      case "heading":
        return `<h2 class="email-heading">${block.content}</h2>`;
      default:
        return String(block.content);
    }
  }
  formatBlock(block) {
    switch (block.type) {
      case "paragraph":
        return `<p class="paragraph">${block.content}</p>`;
      case "bulletList":
        if (!block.content) return "";
        const items = Array.isArray(block.content) ? block.content : [block.content];
        return `<ul class="bullet-list">
                    ${items.map((item) => `<li>${item}</li>`).join("\n")}
                </ul>`;
      case "heading":
        return `<h2 class="heading">${block.content}</h2>`;
      default:
        return String(block.content || "");
    }
  }
  getEmailFormatTemplate() {
    return emailFormatTemplate;
  }
  validateTemplate(template) {
    if (!template.id || !template.html || !template.variables) {
      throw new Error(
        "Invalid template: missing required fields (id, html, variables)"
      );
    }
    if (!template.html.includes("{{content}}") && !template.html.includes("{{blocks}}")) {
      throw new Error(
        "Invalid template: missing required content placeholder"
      );
    }
  }
};

// src/providers/resend.ts
import { Resend } from "resend";
import { elizaLogger } from "@elizaos/core";

// src/providers/errors.ts
var EmailProviderError = class extends Error {
  constructor(provider, originalError, context) {
    super(`Error in ${provider} provider: ${originalError}`);
    this.provider = provider;
    this.originalError = originalError;
    this.context = context;
    this.name = "EmailProviderError";
  }
};
var createEmailProviderError = (provider, error, context) => new EmailProviderError(provider, error, context);

// src/providers/resend.ts
var ResendProvider = class {
  // ms
  constructor(apiKey) {
    this.retryAttempts = 3;
    this.retryDelay = 1e3;
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
          throw new Error("Missing response data from Resend");
        }
        elizaLogger.debug("Email sent successfully", {
          id: response.data.id,
          attempt
        });
        return {
          id: response.data.id,
          provider: "resend",
          status: "success",
          timestamp: /* @__PURE__ */ new Date()
        };
      } catch (error) {
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
    throw createEmailProviderError(
      "resend",
      lastError,
      {
        attempts: this.retryAttempts,
        lastAttemptAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
  }
  shouldRetry(error) {
    if (error instanceof Error) {
      return error.message.includes("network") || error.message.includes("rate limit") || error.message.includes("timeout");
    }
    return false;
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async validateConfig() {
    try {
      await this.client.emails.send({
        from: "test@resend.dev",
        to: "validate@resend.dev",
        subject: "Configuration Test",
        text: "Testing configuration"
      });
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes("unauthorized")) {
        return false;
      }
      return true;
    }
  }
};

// src/services/emailService.ts
var EmailService = class {
  constructor(secrets, templateManager) {
    this.secrets = secrets;
    elizaLogger2.debug("Initializing EmailService");
    this.templateManager = templateManager || new EmailTemplateManager();
    this.provider = new ResendProvider(this.secrets.RESEND_API_KEY);
  }
  async sendEmail(content, options) {
    elizaLogger2.info("Starting email send process", {
      hasContent: !!content,
      contentType: content ? typeof content : "undefined",
      templateManager: !!this.templateManager,
      blocks: content.blocks
    });
    try {
      const html = await this.templateManager.renderEmail(content);
      const plainText = this.generatePlainText(content);
      elizaLogger2.debug("Template rendered", {
        hasHtml: !!html,
        template: options.template || "default",
        htmlLength: html?.length || 0,
        htmlPreview: html ? html.substring(0, 200) : "No HTML generated"
      });
      elizaLogger2.debug("Sending via Resend...");
      const response = await this.provider.sendEmail({
        ...options,
        from: options.from || this.secrets.OWNER_EMAIL || "onboarding@resend.dev",
        subject: content.subject,
        body: plainText,
        text: plainText,
        html,
        headers: {
          ...options.headers,
          "X-Template-ID": options.template || "default",
          "X-Email-Priority": content.metadata.priority
        },
        tags: [
          ...options.tags || [],
          { name: "template", value: options.template || "default" },
          { name: "priority", value: content.metadata.priority }
        ]
      });
      elizaLogger2.debug("Resend API response:", response);
      return {
        id: response.id,
        provider: "resend",
        status: "success",
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      elizaLogger2.error("Failed to send email:", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        options: {
          to: options.to,
          subject: content.subject,
          blocksCount: content.blocks?.length
        }
      });
      throw error;
    }
  }
  generatePlainText(content) {
    const parts = [content.subject, ""];
    content.blocks.forEach((block) => {
      if (block.type === "bulletList" && Array.isArray(block.content)) {
        parts.push(block.content.map((item) => `\u2022 ${item}`).join("\n"));
      } else if (block.type === "heading") {
        parts.push(`
${typeof block.content === "string" ? block.content.toUpperCase() : ""}
`);
      } else {
        parts.push(block.content.toString());
      }
      parts.push("");
    });
    return parts.join("\n");
  }
};

// src/templates/shouldEmail.ts
var shouldEmailTemplate = `
<context>
# Current Conversation
Message: {{message.content.text}}
Previous Context: {{previousMessages}}

# Agent Context
Name: {{agentName}}
Background: {{bio}}
Key Interests: {{topics}}
</context>

<evaluation_steps>
1. Extract Key Quotes:
\u2022 Pull exact phrases about role/company
\u2022 Identify specific technical claims
\u2022 Note any metrics or numbers
\u2022 Capture stated intentions

2. Assess Information Quality:
\u2022 Verify professional context
\u2022 Check for technical specifics
\u2022 Look for concrete project details
\u2022 Confirm decision-making authority

3. Evaluate Readiness:
\u2022 Sufficient context present
\u2022 Actionable information shared
\u2022 Appropriate timing for email
\u2022 Clear follow-up potential

4. Check Partnership Signals:
\u2022 Explicit collaboration interest
\u2022 Technical capability alignment
\u2022 Resource commitment signals
</evaluation_steps>

<instructions>
First, extract the most relevant quotes from the message that indicate email readiness. Put them in <relevant_quotes> tags.

Then, analyze the quotes to determine if an email should be sent.

Respond in this format:
[EMAIL] - This warrants sending an email because <one sentence reason>
[SKIP] - This does not warrant an email

Only base your decision on information explicitly present in the extracted quotes. Do not make assumptions or infer details not directly quoted.
</instructions>

Remember: Quality of information over speed of engagement. Never assume details that aren't explicitly quoted.
`;

// src/services/emailAutomationService.ts
var EmailAutomationService = class extends Service {
  static get serviceType() {
    return ServiceType.EMAIL_AUTOMATION;
  }
  get serviceType() {
    return ServiceType.EMAIL_AUTOMATION;
  }
  constructor() {
    super();
  }
  async initialize(runtime) {
    this.runtime = runtime;
    const isEnabled = runtime.getSetting("EMAIL_AUTOMATION_ENABLED")?.toLowerCase() === "true" || false;
    elizaLogger3.debug(`\u{1F4CB} Email Automation Enabled: ${isEnabled}`);
    if (!isEnabled) {
      elizaLogger3.debug("\u274C Email automation is disabled");
      return;
    }
    elizaLogger3.info("\u{1F504} Initializing Email Automation Service...");
    try {
      const resendApiKey = runtime.getSetting("RESEND_API_KEY");
      const defaultToEmail = runtime.getSetting("DEFAULT_TO_EMAIL");
      const defaultFromEmail = runtime.getSetting("DEFAULT_FROM_EMAIL");
      elizaLogger3.debug("\u{1F511} Checking configuration:", {
        hasApiKey: !!resendApiKey,
        hasToEmail: !!defaultToEmail,
        hasFromEmail: !!defaultFromEmail
      });
      if (!resendApiKey || !defaultToEmail || !defaultFromEmail) {
        throw new Error("Missing required email configuration: RESEND_API_KEY, DEFAULT_TO_EMAIL, DEFAULT_FROM_EMAIL");
      }
      this.emailService = new EmailService({
        RESEND_API_KEY: resendApiKey,
        OWNER_EMAIL: defaultToEmail
      });
      elizaLogger3.success(`\u2705 Service ${this.serviceType} initialized successfully`);
      elizaLogger3.info("\u{1F4E7} Email service ready to process messages");
    } catch (error) {
      elizaLogger3.error("\u274C Failed to initialize email service:", error);
    }
  }
  async buildContext(memory) {
    elizaLogger3.debug("\u{1F504} Building email context for message:", {
      userId: memory.userId,
      messageId: memory.id,
      contentLength: memory.content.text.length
    });
    const state = await this.runtime.composeState(memory);
    if (state) {
      state.message = {
        content: memory.content,
        userId: memory.userId,
        id: memory.id
      };
    }
    return {
      memory,
      state,
      metadata: state?.metadata,
      timestamp: /* @__PURE__ */ new Date(),
      conversationId: memory.id || ""
    };
  }
  async evaluateMessage(memory) {
    if (!this.emailService) {
      elizaLogger3.error("\u274C Email service not initialized");
      throw new Error("Missing required email configuration");
    }
    try {
      const context = await this.buildContext(memory);
      elizaLogger3.info("\u{1F50D} Evaluating accumulated conversation for email automation:", {
        text: memory.content.text,
        userId: memory.userId,
        roomId: memory.roomId
      });
      const shouldEmail = await this.shouldSendEmail(context);
      if (shouldEmail) {
        elizaLogger3.info("\u2728 Accumulated context triggered email automation, preparing to send...");
        await this.handleEmailTrigger(context);
        elizaLogger3.success("\u2705 Email processed and sent successfully");
        return true;
      }
      elizaLogger3.info("\u23ED\uFE0F Current context does not warrant email automation");
      return false;
    } catch (error) {
      elizaLogger3.error("\u274C Error evaluating message for email:", error);
      return false;
    }
  }
  async shouldSendEmail(context) {
    elizaLogger3.info("\u{1F914} Evaluating if message should trigger email...");
    const customPrompt = this.runtime.getSetting("EMAIL_EVALUATION_PROMPT");
    const template = customPrompt || shouldEmailTemplate;
    elizaLogger3.debug("\u{1F4DD} Using template:", {
      isCustom: !!customPrompt,
      templateLength: template.length
    });
    const decision = await generateText({
      runtime: this.runtime,
      context: composeContext({
        state: context.state,
        template
      }),
      modelClass: ModelClass.SMALL
    });
    elizaLogger3.info("\u{1F4DD} Final composed prompt:", {
      prompt: composeContext({
        state: context.state,
        template
      })
    });
    const shouldEmail = decision.includes("[EMAIL]");
    elizaLogger3.info(`\u{1F4CA} Email decision: ${shouldEmail ? "\u2705 Should send" : "\u274C Should not send"}`, {
      decision: decision.trim(),
      trigger: shouldEmail
    });
    return shouldEmail;
  }
  async handleEmailTrigger(context) {
    try {
      const userInfo = {
        id: context.memory.userId,
        displayName: this.formatUserIdentifier(context.memory.userId),
        platform: this.detectPlatform(context.memory.userId),
        metadata: context.metadata || {}
      };
      const messageText = context.memory.content.text;
      const enhancedContext = {
        ...context.state,
        userInfo,
        platform: userInfo.platform,
        originalMessage: messageText,
        // Let the LLM extract and structure the details from the original message
        // rather than hardcoding values
        messageContent: messageText
      };
      const formattedEmail = await generateText({
        runtime: this.runtime,
        context: composeContext({
          state: enhancedContext,
          template: emailFormatTemplate
        }),
        modelClass: ModelClass.SMALL
      });
      const sections = this.parseFormattedEmail(formattedEmail);
      if (!sections.background) {
        elizaLogger3.error("Missing background section in generated email");
        throw new Error("Email generation failed: Missing background section");
      }
      if (!sections.keyPoints || sections.keyPoints.length === 0) {
        elizaLogger3.error("Missing or empty key points in generated email");
        throw new Error("Email generation failed: No key points generated");
      }
      const emailContent = {
        subject: sections.subject,
        blocks: [
          {
            type: "paragraph",
            content: sections.background,
            metadata: {
              style: "margin-bottom: 1.5em;"
            }
          },
          {
            type: "heading",
            content: "Key Points"
          },
          {
            type: "bulletList",
            content: sections.keyPoints
          }
        ],
        metadata: {
          tone: "professional",
          intent: "connection_request",
          priority: "high"
        }
      };
      if (sections.technicalDetails?.length) {
        emailContent.blocks.push(
          {
            type: "heading",
            content: "Technical Details"
          },
          {
            type: "bulletList",
            content: sections.technicalDetails
          }
        );
      }
      if (sections.nextSteps?.length) {
        emailContent.blocks.push(
          {
            type: "heading",
            content: "Next Steps"
          },
          {
            type: "bulletList",
            content: sections.nextSteps
          }
        );
      }
      elizaLogger3.info("\u{1F4CB} Email content prepared:", {
        subject: emailContent.subject,
        blocksCount: emailContent.blocks.length,
        metadata: emailContent.metadata
      });
      const emailOptions = {
        to: this.runtime.getSetting("DEFAULT_TO_EMAIL") || "",
        from: this.runtime.getSetting("DEFAULT_FROM_EMAIL") || "",
        headers: {
          "X-Conversation-ID": context.conversationId,
          "X-User-ID": userInfo.id,
          "X-Platform": userInfo.platform,
          "X-Display-Name": userInfo.displayName
        }
      };
      elizaLogger3.info("\u{1F4E4} Composing email...", {
        to: emailOptions.to,
        from: emailOptions.from,
        conversationId: context.conversationId
      });
      await this.emailService.sendEmail(emailContent, emailOptions);
    } catch (error) {
      elizaLogger3.error("\u274C Email generation failed:", { error, context });
      throw error;
    }
  }
  parseFormattedEmail(formattedEmail) {
    const sections = {};
    try {
      const subjectMatch = formattedEmail.match(/Subject: (.+?)(?:\n|$)/);
      sections.subject = subjectMatch?.[1]?.trim() || "New Connection Request";
      elizaLogger3.debug("\u{1F4DD} Parsed subject:", sections.subject);
      const backgroundMatch = formattedEmail.match(/Background:\n([\s\S]*?)(?=\n\n|Key Points:|$)/);
      sections.background = backgroundMatch?.[1]?.trim() || "";
      elizaLogger3.debug("\u{1F4DD} Parsed background:", {
        found: !!backgroundMatch,
        length: sections.background.length
      });
      const keyPointsMatch = formattedEmail.match(/Key Points:\n([\s\S]*?)(?=\n\n|Technical Details:|Next Steps:|$)/);
      sections.keyPoints = keyPointsMatch?.[1]?.split("\n").filter((point) => point.trim()).map((point) => point.trim().replace(/^[•\-]\s*/, "")) || [];
      elizaLogger3.debug("\u{1F4DD} Parsed key points:", {
        count: sections.keyPoints.length,
        points: sections.keyPoints
      });
      const technicalMatch = formattedEmail.match(/Technical Details:\n([\s\S]*?)(?=\n\n|Next Steps:|$)/);
      if (technicalMatch) {
        sections.technicalDetails = technicalMatch[1]?.split("\n").filter((point) => point.trim()).map((point) => point.trim().replace(/^[•\-]\s*/, ""));
        elizaLogger3.debug("\u{1F4DD} Parsed technical details:", {
          count: sections.technicalDetails.length
        });
      }
      const nextStepsMatch = formattedEmail.match(/Next Steps:\n([\s\S]*?)(?=\n\n|$)/);
      sections.nextSteps = nextStepsMatch?.[1]?.split("\n").filter((step) => step.trim()).map((step) => step.trim().replace(/^(\d+\.|\-|\•)\s*/, "")) || [];
      elizaLogger3.debug("\u{1F4DD} Parsed next steps:", {
        count: sections.nextSteps.length
      });
      if (!sections.subject || !sections.background || !sections.keyPoints.length) {
        elizaLogger3.warn("\u26A0\uFE0F Missing required sections:", {
          hasSubject: !!sections.subject,
          hasBackground: !!sections.background,
          keyPointsCount: sections.keyPoints.length
        });
      }
      return sections;
    } catch (error) {
      elizaLogger3.error("\u274C Error parsing email format:", {
        error: error instanceof Error ? error.message : String(error),
        sections: Object.keys(sections)
      });
      throw new Error(`Failed to parse email format: ${error}`);
    }
  }
  formatUserIdentifier(userId) {
    if (/^\d{17,19}$/.test(userId)) {
      return `Discord User ${userId}`;
    }
    if (userId.includes("@")) {
      return userId;
    }
    return `User ${userId}`;
  }
  detectPlatform(userId) {
    if (/^\d{17,19}$/.test(userId)) {
      return "discord";
    }
    if (userId.includes("@")) {
      return "email";
    }
    return "unknown";
  }
};

// src/index.ts
var emailAutomationPlugin = {
  name: "email-automation",
  description: "AI-powered email automation plugin for Eliza",
  services: [new EmailAutomationService()],
  clients: [],
  evaluators: [],
  providers: []
};
var index_default = emailAutomationPlugin;
export {
  index_default as default
};
//# sourceMappingURL=index.js.map