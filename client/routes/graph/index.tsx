import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { StudentGraph } from "../../components/graph";
import { useData } from "../../utils/use-data";

export const Graph = () => {
  const [graph] = useData<any | null>(`graph`);

  return (
    <AuthenticatedRoute>
      <div>
        <h1 className={styles.title}>{Config.GRAPH.NAME}</h1>
        <h4 className={styles.slogan}>
          Explore and expand the {Config.GRAPH.NAME}
        </h4>
        <StudentGraph graph={graph ?? { nodes: [], links: [] }} />
      </div>
    </AuthenticatedRoute>
  );
};
