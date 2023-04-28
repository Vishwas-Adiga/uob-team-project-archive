import React from "react";
import styles from "./style.module.scss";
import defaultPicture from "../../assets/placeholders/profile_picture.jpeg";

function CustomNode({ person }) {
  const userId = person.id;
  return (
    <img
      className={styles.picture}
      src={person.profilePicture ?? defaultPicture}
      alt=""
    />
  );
}

export default CustomNode;
