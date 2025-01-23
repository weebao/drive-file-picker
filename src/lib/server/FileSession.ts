export class FileSession {
  private headers: Record<string, string> = {};
  private orgId: string = "";
  private connectionId: string = "";
  private resourceUrl: string = "";
  initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    await this.authenticate(); // Supabase
    await this.fetchOrgId();
    const connectionId = await this.fetchConnections();

    this.connectionId = connectionId;
    this.resourceUrl = `${process.env.AUTH_URL}/connections/${connectionId}/resources/children`;
  }

  private async authenticate() {
    const supabaseUrl = `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`;
    const authRes = await fetch(supabaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: process.env.API_KEY ?? "api-key",
      },
      body: JSON.stringify({
        email: process.env.AUTH_EMAIL,
        password: process.env.AUTH_PASSWORD,
        gotrue_meta_security: {},
      }),
    });
    if (!authRes.ok) {
      throw new Error("Failed to authenticate");
    }

    const authData = await authRes.json();
    this.headers = {
      Authorization: `Bearer ${authData.access_token}`,
      "Content-Type": "application/json",
    };
  }

  private async fetchOrgId() {
    const orgUrl = `${process.env.AUTH_URL}/organizations/me/current`;
    const orgRes = await fetch(orgUrl, { headers: this.headers });
    if (!orgRes.ok) {
      throw new Error("Failed to fetch organization ID");
    }
    const orgData = await orgRes.json();
    this.orgId = orgData.org_id;
  }

  private async fetchConnections(): Promise<string> {
    const connectionsUrl = `${process.env.AUTH_URL}/connections?connection_provider=gdrive&limit=1`;
    const connectionsRes = await fetch(connectionsUrl, {
      headers: this.headers,
    });
    if (!connectionsRes.ok) {
      throw new Error("Failed to fetch connections");
    }

    const connections = await connectionsRes.json();
    if (connections.length === 0) {
      throw new Error("No connections found");
    }
    return connections[0].connection_id;
  }

  async createKb(resourceIds: string[]) {
    // Build knowledge base
    const payload = {
      connection_id: this.connectionId,
      connection_source_ids: resourceIds,
      name: "Test Knowledge Base",
      description: "This is a test knowledge base",
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: "text-embedding-ada-002",
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: "sentence",
        },
      },
    };
    const newKbRes = await fetch(`${process.env.AUTH_URL}/knowledge_bases`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    if (!newKbRes.ok) {
      throw new Error("Failed to create knowledge base");
    }
    const newKbData = await newKbRes.json();
    const kbId = newKbData.knowledge_base_id;

    // Sync knowledge base with org
    const syncUrl = `${process.env.AUTH_URL}/knowledge_bases/sync/trigger/${kbId}/${this.orgId}`;
    const syncResponse = await fetch(syncUrl, { headers: this.headers });
    if (!syncResponse.ok) {
      throw new Error("Failed to sync knowledge base");
    }

    return kbId;
  }

  async getResource(resourceId?: string | null): Promise<any[]> {
    const url = resourceId
      ? `${this.resourceUrl}?resource_id=${resourceId}`
      : `${this.resourceUrl}`;
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      throw new Error("Failed to fetch resources");
    }
    return (await res.json()).data;
  }

  async getResourceFromKb(kbId: string, resourcePath?: string): Promise<any[]> {
    const url = `${process.env.AUTH_URL}/knowledge_bases/${kbId}/resources/children?resource_path=${resourcePath}`;
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      throw new Error("Failed to fetch resources");
    }
    if (res.status === 400) {
      throw new Error("Bad Request");
    }
    return (await res.json()).data;
  }

  async deleteResourceFromKb(kbId: string, resourcePath: string) {
    const url = `${process.env.AUTH_URL}/knowledge_bases/${kbId}/resources?resource_path=${resourcePath}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error("Failed to delete resource");
    }
  }
}
