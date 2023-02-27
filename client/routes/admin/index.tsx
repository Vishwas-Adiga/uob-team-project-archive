import { AdminRoute } from "../../components/conditional-route";

export const Admin = () => {
  return (
    <AdminRoute>
      <div>
        <h1>This is the admin panel</h1>
      </div>
    </AdminRoute>
  );
};
