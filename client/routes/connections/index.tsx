import { AuthenticatedRoute } from "../../components/conditional-route";

export const Connections = () => {
  return (
    <AuthenticatedRoute>
      <div>
        <h1>Connections</h1>
      </div>
    </AuthenticatedRoute>
  );
};
