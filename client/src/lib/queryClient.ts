import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    try {
      // Try to parse as JSON first (for API errors)
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || res.statusText;
    } catch {
      // If not JSON, create a new response to avoid body consumption issues
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

// Support both old and new signatures for compatibility
export async function apiRequest(
  urlOrMethod: string,
  methodOrData?: string | unknown,
  data?: unknown,
): Promise<any> {
  let url: string;
  let method: string;
  let requestData: unknown;

  if (typeof methodOrData === 'string') {
    // New signature: apiRequest(url, method, data)
    url = urlOrMethod;
    method = methodOrData;
    requestData = data;
  } else {
    // Old signature: apiRequest(method, url, data) 
    method = urlOrMethod;
    url = methodOrData as string;
    requestData = data;
  }

  const res = await fetch(url, {
    method,
    headers: requestData ? { "Content-Type": "application/json" } : {},
    body: requestData ? JSON.stringify(requestData) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage: string;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || res.statusText;
    } catch {
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
  
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      let errorMessage: string;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || res.statusText;
      } catch {
        errorMessage = res.statusText || `HTTP ${res.status}`;
      }
      throw new Error(`${res.status}: ${errorMessage}`);
    }
    
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
