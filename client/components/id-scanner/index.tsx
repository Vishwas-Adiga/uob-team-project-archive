import { useCallback, useEffect, useState } from "react";
import {
  Friendship,
  Identification,
  QrCode,
  WarningHex,
} from "@carbon/icons-react";
import { Button, ContentSwitcher, Modal, Switch } from "@carbon/react";
import { QrReader } from "react-qr-reader";
import { useRecoilState, useRecoilValue } from "recoil";
import { scannerState } from "../../state/scanner-state";
import styles from "./style.module.scss";
import { Config } from "../../config";
import { CouldNotScan } from "./could-not-scan";
import { ScanSuccessful } from "./scan-successful";
import { User } from "../../state/types";
import { patch, post } from "../../utils/fetch";
import { IdBadge } from "@carbon/pictograms-react";
import { userState } from "../../state/user-state";

const NFC_SUPPORTED = "NDEFReader" in window;
export const IdScanner = () => {
  const [scanner, setScanner] = useRecoilState(scannerState);
  const user = useRecoilValue(userState);
  const [mode, setMode] = useState<"qr" | "nfc">("qr");
  const [nfcErrorModalOpen, setNfcErrorModalOpen] = useState(false);
  const [connectedUser, setConnectedUser] = useState<User | null>(null);
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

  const onReadingError = useCallback(() => {
    setScanner({ ...scanner, open: false });
    setNfcErrorModalOpen(true);
  }, [scanner, setScanner, setNfcErrorModalOpen]);

  const onReading = useCallback(
    async ({ message, serialNumber }) => {
      if (!scanner.open) return;

      if (scanner.mode === "read") {
        console.log(`Read card with fingerprint: ${serialNumber}`);
        setScanner(scanner => ({ ...scanner, open: false }));
        const response = await post(`requests`, {
          signature: serialNumber,
        });
        if (!response.ok) {
          return setNfcErrorModalOpen(true);
        }

        const user: User = await response.json();
        setConnectedUser(user);
      } else {
        if (user) {
          const response = await patch(`users/${user.userId}`, {
            nfcTag: serialNumber,
          });

          if (!response.ok) {
            return setNfcErrorModalOpen(true);
          }
          window.alert("Student ID registered");
        }
      }
    },
    [scanner, user, setConnectedUser, setNfcErrorModalOpen]
  );

  useEffect(() => {
    if (!NFC_SUPPORTED) return;
    if (!nfcGranted) return;

    const ndef = new NDEFReader();

    const setupNfc = async () => {
      await ndef.scan();
      ndef.addEventListener("readingerror", onReadingError);
      // @ts-ignore
      ndef.addEventListener("reading", onReading);
    };

    setupNfc();
    return () => {
      ndef.removeEventListener("readingerror", onReadingError);
      // @ts-ignore
      ndef.removeEventListener("reading", onReading);
    };
  }, [NFC_SUPPORTED, nfcGranted, scanner]);

  const onQrCodeScan = useCallback(
    result => {
      if (!result?.getText()) return;
      setScanner({ ...scanner, open: false });
      // TODO implement QR code scanning
    },
    [setScanner]
  );

  return (
    <>
      <CouldNotScan
        open={nfcErrorModalOpen}
        onRequestClose={setNfcErrorModalOpen.bind(null, false)}
      />
      <ScanSuccessful
        user={connectedUser}
        onRequestClose={setConnectedUser.bind(null, null)}
      />

      {scanner.mode === "read" && (
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
                onResult={onQrCodeScan}
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
      )}
      {scanner.mode === "register" && (
        <Modal
          open={scanner.open}
          passiveModal
          onRequestClose={setScanner.bind(null, { open: false })}
          modalHeading="Register your student ID"
          size="sm"
          className={styles.scanner}
        >
          <div className={styles.nfcRegisterPictogram}>
            <IdBadge />
          </div>

          <h3>How to register</h3>
          <section className={styles.directions}>
            <span>1</span>
            <p>
              Tap your student ID on the back of your phone to link it to{" "}
              {Config.APP.NAME}
            </p>
            <span>2</span>
            <p>
              Use your student ID to connect with others by tapping it against
              their phones
            </p>
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
      )}
    </>
  );
};
