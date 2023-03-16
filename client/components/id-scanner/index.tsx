import { useCallback, useEffect, useState } from "react";
import {
  Friendship,
  Identification,
  QrCode,
  WarningHex,
} from "@carbon/icons-react";
import { Button, ContentSwitcher, Modal, Switch } from "@carbon/react";
import { QrReader } from "react-qr-reader";
import { useRecoilState } from "recoil";
import { scannerState } from "../../state/scanner-state";
import styles from "./style.module.scss";
import { Config } from "../../config";

const NFC_SUPPORTED = "NDEFReader" in window;
export const IdScanner = () => {
  const [scanner, setScanner] = useRecoilState(scannerState);
  const [mode, setMode] = useState<"qr" | "nfc">("qr");
  const [nfcErrorModalOpen, setNfcErrorModalOpen] = useState(false);
  const [connectionSuccessfulModalOpen, setConnectionSuccessfulModalOpen] =
    useState(false);
  const [nfcGranted, setNfcGranted] = useState(
    localStorage.getItem(Config.STORAGE.NFC_PERM) === "granted"
  );
  const switchMode = useCallback(({ name }) => setMode(name), []);

  const requestNfcPermissions = useCallback(async () => {
    const ndef = new NDEFReader();
    await ndef.scan();
    // @ts-ignore
    const status = await navigator.permissions.query({ name: "nfc" });
    localStorage.setItem(Config.STORAGE.NFC_PERM, status.state);
    setNfcGranted(status.state === "granted");
  }, []);

  useEffect(() => {
    if (!NFC_SUPPORTED) return;
    if (!nfcGranted) return;

    const ndef = new NDEFReader();
    const setupNfc = async () => {
      await ndef.scan();
      ndef.addEventListener("readingerror", () => {
        setScanner({ open: false });
        setNfcErrorModalOpen(true);
      });

      // @ts-ignore
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(`Read card with fingerprint: ${serialNumber}`);
        setScanner({ open: false });
        setConnectionSuccessfulModalOpen(true);
      });
    };

    setupNfc();
  }, [NFC_SUPPORTED, nfcGranted]);

  return (
    <>
      <Modal
        open={nfcErrorModalOpen}
        passiveModal
        onRequestClose={setNfcErrorModalOpen.bind(null, false)}
        size="xs"
        className={`${styles.nfcModal} ${styles.nfcErrorModal}`}
      >
        <WarningHex />
        <h4>Could not scan ID. Try again</h4>
      </Modal>
      <Modal
        open={connectionSuccessfulModalOpen}
        passiveModal
        onRequestClose={setConnectionSuccessfulModalOpen.bind(null, false)}
        size="xs"
        className={styles.nfcModal}
      >
        <Friendship />
        <h4>Max Gater is now a connection!</h4>
      </Modal>
      <Modal
        open={scanner.open}
        passiveModal
        onRequestClose={setScanner.bind(null, { open: false })}
        modalHeading="Start a new connection"
        size="sm"
        className={styles.scanner}
      >
        {NFC_SUPPORTED && (
          <ContentSwitcher selectedIndex={0} size="sm" onChange={switchMode}>
            <Switch name="qr" text="Scan a QR Code" />
            <Switch name="nfc">Tap to connect</Switch>
          </ContentSwitcher>
        )}
        <h2>{mode === "qr" ? "Scan a QR code" : "Tap to connect"}</h2>
        {mode === "qr" && scanner.open && (
          <div className={styles.qrScanner}>
            <QrReader
              constraints={{ facingMode: "environment" }}
              videoContainerStyle={{
                height: 300,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
              }}
              onResult={result => {
                if (!result?.getText()) return;
                setScanner({ open: false });
                setConnectionSuccessfulModalOpen(true);
              }}
              ViewFinder={QrCode}
            />
          </div>
        )}

        {mode === "nfc" && (
          <div className={styles.nfcPictogram}>
            <Identification />
          </div>
        )}

        <h3>How to connect</h3>
        <section className={styles.directions}>
          <span>1</span>
          <p>Find someone who wants to connect with you</p>
          <span>2</span>
          {mode === "qr" && (
            <p>
              Scan the QR code on their {Config.APP.NAME} to send a connection
              request
            </p>
          )}
          {mode === "nfc" && (
            <p>
              Tap your phone against their university issued ID card (works
              anywhere in the app, even when this dialog isn't open)
            </p>
          )}
          <span>3</span>
          {mode === "qr" && (
            <p>
              Have them accept your connection request to start a connection
            </p>
          )}
          {mode === "nfc" && <p>You now have a new connection!</p>}
        </section>
        {mode === "nfc" && !nfcGranted && (
          <Button
            onClick={requestNfcPermissions}
            className={styles.requestNfcButton}
          >
            Allow {Config.APP.NAME} to read student IDs
          </Button>
        )}
      </Modal>
    </>
  );
};
