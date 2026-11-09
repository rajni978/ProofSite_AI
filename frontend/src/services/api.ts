export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface ApiErrorBody {
  error?: {
    message?: unknown;
  };
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        accept: "application/json",
        ...(init?.body ? { "content-type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiRequestError("Unable to reach ProofSite AI. Please try again.", 0);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const body = payload as ApiErrorBody | null;
    const message = body?.error?.message;
    throw new ApiRequestError(
      typeof message === "string" && message.length <= 240
        ? message
        : "The request could not be completed. Please try again.",
      response.status,
    );
  }

  return payload as T;
}
