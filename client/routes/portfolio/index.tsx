import { AuthenticatedRoute } from "../../components/conditional-route";

export const Portfolio = () => (
  <AuthenticatedRoute>
    <h1>Portfolio</h1>
  </AuthenticatedRoute>
);
