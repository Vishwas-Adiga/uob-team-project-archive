import { WarningHex } from "@carbon/icons-react";
import { Modal } from "@carbon/react";
import styles from "./style.module.scss";

export interface CouldNotScanProps {
  open: boolean;
  onRequestClose: () => void;
}

export const CouldNotScan = (props: CouldNotScanProps) => (
  <Modal
    open={props.open}
    passiveModal
    onRequestClose={props.onRequestClose}
    size="xs"
    className={`${styles.nfcModal} ${styles.nfcErrorModal}`}
  >
    <WarningHex />
    <h4>Could not scan ID. Try again</h4>
  </Modal>
);
