/**
 * Community API transport for Social.
 *
 * Browser requests remain same-origin by default. In development configure
 * Vite's /api proxy to the Community staging service; do not embed credentials
 * or cross-origin tokens in frontend code.
 */
export type CommunityAudience = "private" | "friends" | "public";

export interface CommunityItem {
  id: string;
  kind: string;
  ownerId?: string;
  body?: unknown;
  createdAt?: string;
  audience?: CommunityAudience;
  [key: string]: unknown;
}

export class CommunityApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "CommunityApiError";
  }
}

export async function communityRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Community API path must be relative");
  }
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body != null && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch("/api/community" + path, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Community API error (${response.status})`;
    throw new CommunityApiError(message, response.status);
  }
  return data as T;
}

export function getCommunityFeed(
  mode: "public" | "friends" = "public",
  before?: string,
): Promise<{ success: boolean; items: CommunityItem[]; next: string | null }> {
  const query = new URLSearchParams({ mode });
  if (before) query.set("before", before);
  return communityRequest("/feed?" + query.toString());
}

export function createCommunityPost(payload: unknown) {
  return communityRequest<{ success: boolean; id: string }>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function reactToCommunityItem(id: string, emoji: string) {
  return communityRequest<{ success: boolean }>(
    "/items/" + encodeURIComponent(id) + "/reaction",
    { method: "POST", body: JSON.stringify({ emoji }) },
  );
}
