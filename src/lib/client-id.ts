"use client";

const storageKey = "whos-the-killer-client-id";

export function getOrCreateClientId() {
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const clientId = crypto.randomUUID();
  window.localStorage.setItem(storageKey, clientId);
  return clientId;
}
