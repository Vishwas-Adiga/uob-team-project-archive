import { Helmet } from "react-helmet";
import styles from "./style.module.scss";

export const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Resource not found</title>
      </Helmet>
      <div className={styles.container}>
        <h1>404</h1>
        <h2>
          &#10240;&nbsp;&nbsp;Your sleep schedule 🤝 The requested resource
        </h2>
        <h2>Not found</h2>
      </div>
    </>
  );
};
