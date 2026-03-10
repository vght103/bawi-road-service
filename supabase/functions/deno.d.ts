// Supabase Edge Runtime(Deno) 전역 타입 — 로컬/IDE용. 배포 시 Deno가 제공

declare namespace Deno {
  const env: { get(key: string): string | undefined };
  function serve(handler: (req: Request) => Promise<Response> | Response): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: object): any;
}

declare module "https://esm.sh/aws4fetch@1.0.20" {
  export class AwsClient {
    constructor(config: { accessKeyId: string; secretAccessKey: string });
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    sign(input: Request, options?: { aws?: { signQuery?: boolean } }): Promise<Request>;
  }
}
