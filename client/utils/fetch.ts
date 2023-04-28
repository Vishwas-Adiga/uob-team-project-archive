import { Config } from "../config";

type ApiVersion = "v1";

export const post = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("POST", url, body, apiVersion);

export const get = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("GET", url, body, apiVersion);

export const patch = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("PATCH", url, body, apiVersion);

export const del = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("DELETE", url, body, apiVersion);

const req = async (
  method: string,
  url: string,
  body?: any,
  apiVersion?: ApiVersion
) => {
  const token = localStorage.getItem(Config.STORAGE.JWT_TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return await fetch(`/api/${apiVersion ?? "v1"}/${url}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};
