// TODO: Replace with real Email/CRM integrations
// Supported providers: HubSpot, Salesforce, Klaviyo, Mailchimp, Custom Webhook

export type EmailProvider = 'HubSpot' | 'Salesforce' | 'Klaviyo' | 'Mailchimp' | 'Custom';

export interface EmailProviderConfig {
  provider: EmailProvider;
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAt?: string;
}

export interface FieldMapping {
  appField: string;
  crmField: string;
}

export interface EmailCrmState {
  config: EmailProviderConfig | null;
  fieldMappings: FieldMapping[];
}

class EmailCrmStubService {
  private state: EmailCrmState = {
    config: null,
    fieldMappings: [
      { appField: 'email', crmField: 'email' },
      { appField: 'firstName', crmField: 'first_name' },
      { appField: 'lastName', crmField: 'last_name' },
      { appField: 'userType', crmField: 'segment' },
      { appField: 'interests', crmField: 'tags' },
    ],
  };

  /**
   * Simulates OAuth connection to email/CRM provider
   * TODO: Implement real OAuth flows for each provider:
   * - HubSpot: https://developers.hubspot.com/docs/api/oauth
   * - Salesforce: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_oauth_and_connected_apps.htm
   * - Klaviyo: API key based
   * - Mailchimp: OAuth 2.0
   * - Custom: Webhook configuration
   */
  async connectProvider(provider: EmailProvider, credentials?: { apiKey?: string; webhookUrl?: string }): Promise<EmailProviderConfig> {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.state.config = {
      provider,
      connected: true,
      apiKey: credentials?.apiKey || `${provider.toLowerCase()}_key_${Math.random().toString(36).substring(7)}`,
      webhookUrl: credentials?.webhookUrl,
      connectedAt: new Date().toISOString(),
    };

    return this.state.config;
  }

  /**
   * Disconnects current email/CRM provider
   */
  async disconnectProvider(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.state.config = null;
  }

  /**
   * Gets current provider configuration
   */
  getProviderConfig(): EmailProviderConfig | null {
    return this.state.config;
  }

  /**
   * Sends a test email to verify integration
   * TODO: Implement real email sending through provider API
   */
  async sendTestEmail(to: string, subject: string = 'Test Email from The Ready Lab'): Promise<{ success: boolean; messageId?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!this.state.config?.connected) {
      throw new Error('No email provider connected');
    }

    return {
      success: true,
      messageId: `msg_${Math.random().toString(36).substring(7)}`,
    };
  }

  /**
   * Updates field mappings between app and CRM
   * TODO: Validate field mappings against provider schema
   */
  async updateFieldMappings(mappings: FieldMapping[]): Promise<FieldMapping[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.state.fieldMappings = mappings;
    return mappings;
  }

  /**
   * Gets current field mappings
   */
  getFieldMappings(): FieldMapping[] {
    return this.state.fieldMappings;
  }

  /**
   * Syncs a user to the connected CRM
   * TODO: Implement real sync for each provider
   */
  async syncUser(userData: Record<string, any>): Promise<{ success: boolean; crmId?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!this.state.config?.connected) {
      throw new Error('No CRM provider connected');
    }

    // Map app fields to CRM fields
    const mappedData: Record<string, any> = {};
    this.state.fieldMappings.forEach(mapping => {
      if (userData[mapping.appField]) {
        mappedData[mapping.crmField] = userData[mapping.appField];
      }
    });

    return {
      success: true,
      crmId: `crm_contact_${Math.random().toString(36).substring(7)}`,
    };
  }
}

export const EmailCrmStub = new EmailCrmStubService();
