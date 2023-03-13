import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user-state";
import { Routes } from "../../routes";

export const AuthenticatedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useRecoilValue(userState);
  return user ? children : <Navigate to={Routes.AUTH_SIGN_IN()} replace />;
};

export const AnonymousRoute = ({ children }: { children: JSX.Element }) => {
  const user = useRecoilValue(userState);
  return user ? <Navigate to={Routes.PORTFOLIO()} replace /> : children;
};

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = useRecoilValue(userState);
  return user?.admin ? children : <Navigate to={Routes.PORTFOLIO()} replace />;
};
