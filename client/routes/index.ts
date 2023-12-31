export const Routes = {
  ADMIN: () => `/admin`,
  AUTH: () => `/auth`,
  AUTH_SIGN_UP: () => `${Routes.AUTH()}/sign-up`,
  AUTH_SIGN_IN: () => `${Routes.AUTH()}/sign-in`,
  CONNECTIONS: () => `/connections`,
  GRAPH: () => `/graph`,
  NOT_FOUND: () => `/404`,
  PORTFOLIO: (pid?: string) => `/portfolio/${pid ?? ":pid"}`,
  PREFERENCES: () => `/preferences`,
  PRIVACY_POLICY: () => `/privacy-policy`,
  RECOMMENDATIONS: () => `/recommendations`,
  REQUESTS: () => `/requests`,
  SEARCH: (query?: string) => `/search${query ? "?query=" + query : ""}`,
  REPORTING: (uid?: string) => `/reporting/${uid ?? ":uid"}`,
};
