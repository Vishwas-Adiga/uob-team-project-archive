import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";

export const Graph = () => (
  <AuthenticatedRoute>
    <h1>{Config.GRAPH.NAME}</h1>
  </AuthenticatedRoute>
);
