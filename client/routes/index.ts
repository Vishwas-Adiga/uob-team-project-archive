export const Routes = {
  ADMIN: () => `/admin`,
  AUTH: () => `/auth`,
  AUTH_SIGN_UP: () => `${Routes.AUTH()}/sign-up`,
  AUTH_SIGN_IN: () => `${Routes.AUTH()}/sign-in`,
  NOT_FOUND: () => `/404`,
  PORTFOLIO: (pid?: string) => `/portfolio/${pid ?? ":pid"}`,
  PRIVACY_POLICY: () => `/privacy-policy`,
  GRAPH: () => `/graph`,
};
