import styles from "./style.module.scss";

function CustomNode({ person }) {
  const userId = person.id;
  return (
    <img
      className={styles.picture}
      src={`/api/v1/portfolios/${userId}/profile-picture`}
      alt=""
    />
  );
}

export default CustomNode;
