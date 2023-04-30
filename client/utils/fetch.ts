import { Config } from "../config";

type ApiVersion = "v1";

export const post = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("POST", url, body, undefined, apiVersion);

export const postFile = (url: string, file: any, apiVersion?: ApiVersion) =>
  req("POST", url, undefined, file, apiVersion);

export const get = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("GET", url, body, undefined, apiVersion);

export const patch = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("PATCH", url, body, undefined, apiVersion);

export const del = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("DELETE", url, body, undefined, apiVersion);

const req = async (
  method: string,
  url: string,
  body?: any,
  file?: any,
  apiVersion?: ApiVersion
) => {
  const token = localStorage.getItem(Config.STORAGE.JWT_TOKEN_KEY);
  const headers = !file
    ? {
        "Content-Type": "application/json",
      }
    : {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (file) {
    // express-fileupload requires a form data.
    body = new FormData();
    body.append("file", file);
  }
  return await fetch(`/api/${apiVersion ?? "v1"}/${url}`, {
    method,
    // @ts-ignore
    headers,
    body: file ? body : JSON.stringify(body),
  });
};
