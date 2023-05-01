import { Button, Tile } from "@carbon/react";
import { Portfolio } from "../../state/types";
import styles from "./style.module.scss";
import { useData } from "../../utils/use-data";
import { Home, Microscope, Locked, Edit } from "@carbon/icons-react";
import { Config } from "../../config";
import { useCallback, useEffect, useState } from "react";
import { post } from "../../utils/fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user-state";
export const PortfolioInfo = (props: Portfolio) => {
  const navigate = useNavigate();
  const [connections] = useData<Array<any>>("connections");
  const connected = connections?.map(c => c.userId).includes(props.userId);

  const [requests, invalidateRequests] = useData<Array<any>>("requests");
  const requested = requests?.map(c => c.userId).includes(props.userId);

  const [requestSent, updateRequestSent] = useState(true);

  const user = useRecoilValue(userState);
  useEffect(() => {
    if (user) {
      updateRequestSent(false);
    }
  }, [user]);

  const requestConnection = useCallback(async () => {
    if (requestSent) {
      return;
    }
    const response = await post(`requests/${props.userId}`);
    if (!response.ok) {
      alert("Could not send connection request. Please try again later");
      return;
    }
    invalidateRequests();
  }, [props, invalidateRequests, requestSent]);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("connect");
  if (user && (connections === undefined || requests === undefined)) {
    return <p>Loading...</p>;
  }
  if (
    !requestSent &&
    user &&
    !props.ownPortfolio &&
    searchQuery !== null &&
    !requested &&
    !connected
  ) {
    updateRequestSent(true);
    requestConnection();
  }

  return (
    <Tile className={styles.portfolioInfo}>
      <img className={styles.profilePhoto} src={props.profilePicture} alt="" />
      {!user && (
        <Button className={styles.connectButton} disabled>
          Sign in to connect
        </Button>
      )}
      {user && !props.ownPortfolio && (
        <Button
          className={styles.connectButton}
          disabled={connected || requested}
          onClick={requestConnection}
        >
          {connected && "Connected"}
          {requested && "Connection request sent"}
          {!connected && !requested && `Connect with ${splitName(props.name)}`}
        </Button>
      )}
      {user && props.ownPortfolio && (
        <Button
          className={styles.connectButton}
          renderIcon={Edit}
          onClick={navigate.bind(null, "/preferences")}
        >
          Edit profile
        </Button>
      )}
      <h1>{props.name}</h1>
      <div className={styles.portfolioDescription}>
        {props.Course && (
          <div>
            <Microscope size={24} />
            <p>{props.Course.name}</p>
          </div>
        )}
        {props.Accommodation && (
          <div>
            <Home size={24} />
            <p>{props.Accommodation.name}</p>
          </div>
        )}
        <div>
          <Locked size={24} />
          <p>
            {props.privacy} {Config.APP.NAME}
          </p>
        </div>
      </div>
      <div className={styles.qrCodeContainer}>
        <QRCodeSVG
          value={window.location.toString()}
          className={styles.qrCode}
        />
        <p className={styles.qrCodeLabel}>Scan to connect with {props.name}</p>
      </div>
    </Tile>
  );
};

const splitName = (fullName: string) => fullName.split(" ")[0];
