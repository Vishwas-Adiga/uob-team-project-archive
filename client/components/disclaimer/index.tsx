import { ToastNotification } from "@carbon/react";
import styles from "./style.module.scss";

export const Disclaimer = () => (
  <ToastNotification
    className={styles.disclaimer}
    caption={
      <span>
        This server is provided by the School of Computer Science at the
        University of Birmingham to allow users to provide feedback on software
        developed by students as part of an assignment. While we take reasonable
        precautions, we cannot guarantee the security of the data entered into
        the system. Do NOT enter any real personal data (e.g., financial
        information or otherwise) into the system. <br />
        <strong>
          The assignment runs until May 31st 2023, after which the server and
          all associated data will be destroyed.
        </strong>
      </span>
    }
    iconDescription="Closes site disclaimer"
    timeout={0}
    title="Alpha Project Disclaimer"
    kind="warning"
  />
);
