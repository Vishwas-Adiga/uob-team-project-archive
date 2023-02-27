import { Config } from "../config";

type ApiVersion = "v1";

export const post = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("post", url, body, apiVersion);

export const get = (url: string, body?: any, apiVersion?: ApiVersion) =>
  req("get", url, body, apiVersion);

const req = async (
  method: string,
  url: string,
  body?: any,
  apiVersion?: ApiVersion
) => {
  const token = localStorage.getItem(Config.STORAGE.JWT_TOKEN_KEY);
  return await fetch(`/api/${apiVersion ?? "v1"}/${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
