import { Database } from "@/app/types/database";
import { createBrowserClient } from "@supabase/ssr";

const MISSING_SUPABASE_ENV_ERROR =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

export function hasSupabaseConfig() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const createMissingClient = () => {
  const missingError = new Error(MISSING_SUPABASE_ENV_ERROR);
  const missingResult = { data: null, error: missingError };

  const chainProxy = new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === "then") {
          return (resolve: (value: unknown) => void) =>
            resolve({ data: null, error: missingError });
        }

        if (property === "catch") {
          return (onRejected: (reason: Error) => unknown) =>
            Promise.reject(missingError).catch(onRejected);
        }

        if (property === "finally") {
          return (onFinally: () => unknown) =>
            Promise.reject(missingError).finally(onFinally);
        }

        if (typeof property === "symbol") {
          return undefined;
        }

        return (..._args: unknown[]) => chainProxy;
      },
    },
  );

  return {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signInWithPassword: async () => ({ error: missingError }),
      signUp: async () => ({ error: missingError }),
      signOut: async () => ({ error: missingError }),
      getUser: async () => ({ data: { user: null }, error: missingError }),
      getSession: async () => ({ data: { session: null }, error: missingError }),
    },
    from: () => chainProxy,
    rpc: async () => missingResult,
    channel: () => ({
      on: () => ({
        subscribe: () => ({ unsubscribe: () => undefined }),
      }),
      subscribe: () => ({ unsubscribe: () => undefined }),
    }),
    storage: {
      from: () => ({
        upload: async () => missingResult,
        update: async () => missingResult,
        remove: async () => missingResult,
        list: async () => missingResult,
        download: async () => missingResult,
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as unknown as ReturnType<typeof createBrowserClient<Database>>;
};

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (!client) {
      client = createMissingClient();
    }
    return client;
  }

  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  }

  return client;
}