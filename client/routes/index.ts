export const Routes = {
  ADMIN: () => `/admin`,
  AUTH: () => `/auth`,
  AUTH_SIGN_UP: () => `${Routes.AUTH()}/sign-up`,
  AUTH_SIGN_IN: () => `${Routes.AUTH()}/sign-in`,
  PORTFOLIO: () => `/portfolio`,
};
