import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { StudentGraph } from "../../components/graph";
import { useData } from "../../utils/use-data";
import { Helmet } from "react-helmet";

export const Graph = () => {
  const [graph] = useData<any | null>(`graph`);

  return (
    <AuthenticatedRoute>
      <div className={styles.container}>
        <Helmet>
          <title>
            {Config.GRAPH.NAME} | {Config.APP.NAME}
          </title>
        </Helmet>
        <h3>{Config.GRAPH.NAME}</h3>
        <h4>Explore and expand the {Config.GRAPH.NAME}</h4>
        <StudentGraph graph={graph ?? { nodes: [], links: [] }} />
      </div>
    </AuthenticatedRoute>
  );
};
