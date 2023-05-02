import { WarningHex } from "@carbon/icons-react";
import { Modal } from "@carbon/react";
import styles from "./style.module.scss";

export interface CouldNotScanProps {
  open: string | null;
  onRequestClose: () => void;
}

export const CouldNotScan = (props: CouldNotScanProps) => (
  <Modal
    open={props.open !== null}
    passiveModal
    onRequestClose={props.onRequestClose}
    size="xs"
    className={`${styles.nfcModal} ${styles.nfcErrorModal}`}
  >
    <WarningHex />
    <h4>{props.open}</h4>
  </Modal>
);
