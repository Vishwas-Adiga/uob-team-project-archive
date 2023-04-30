import { Button, Modal } from "@carbon/react";
import styles from "./style.module.scss";
import { User } from "../../state/types";
import { Config } from "../../config";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";

export interface ScanSuccessfulProps {
  onRequestClose: () => void;
  user: User | null;
}

export const ScanSuccessful = (props: ScanSuccessfulProps) => {
  useEffect(() => {
    if (props.user) {
      confetti({
        zIndex: 10000,
        particleCount: 200,
        spread: 100,
        disableForReducedMotion: true,
      });
    }
  }, [props.user]);

  const navigate = useNavigate();

  return (
    <Modal
      open={!!props.user}
      passiveModal
      onRequestClose={props.onRequestClose}
      size="xs"
      className={styles.nfcModal}
    >
      <img src={`/api/vi/portfolios/${props.user?.userId}/profile-picture`} />
      <h4>You are connected with {props.user?.name}!</h4>
      <Button
        onClick={navigate.bind(
          null,
          Routes.PORTFOLIO(props.user?.userId.toString())
        )}
      >
        View {props.user?.name.split(" ")[0]}'s {Config.APP.NAME}
      </Button>
    </Modal>
  );
};
