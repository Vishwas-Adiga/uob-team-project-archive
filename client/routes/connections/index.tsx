import { useEffect, useState } from "react";
import { del, get } from "../../utils/fetch";
import { redirect, useParams, useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import { Connections as ConnectionsState } from "../../state/connections-state";
import { Button } from "@carbon/react";
import { ArrowRight, UserAvatar } from "@carbon/icons-react";
import { AuthenticatedRoute } from "../../components/conditional-route";
import moment from "moment";
export const AllConnections = () => {
  const navigate = useNavigate();
  const navigateToRequests = () => {
    navigate("/requests");
  };
  const dateTimeAgo = dateGiven => {
    return moment(new Date(dateGiven)).fromNow();
  };
  const [connections, setConnections] = useState<ConnectionsState[]>([]);
  const { pid } = useParams();
  const fetchData = async () => {
    const response = await get(`connections`);
    if (!response.ok) redirect("404");
    const json = await response.json();
    setConnections(json);
  };

  function Btn(props) {
    const [buttonText, setButtonText] = useState("Connected");

    async function handleClick(id: number) {
      setButtonText("Connect");
      await del(`connections/${id}`);
    }

    return (
      <Button
        className={styles.btn3}
        renderIcon={UserAvatar}
        size="md"
        type="button"
        onClick={handleClick.bind(null, props.id)}
      >
        {buttonText}
      </Button>
    );
  }

  useEffect(() => {
    fetchData();
  }, [pid]);
  if (connections)
    return (
      <AuthenticatedRoute>
        <div>
          <h1 className={styles.connectTitle}>Connections</h1>
          <Button
            className={styles.btn4}
            onClick={navigateToRequests}
            renderIcon={ArrowRight}
            size="md"
            kind="ghost"
          >
            Requests{" "}
          </Button>
          {connections.map(w => (
            <div className={styles.wrapper}>
              <img
                className={styles.img}
                alt={`${w.name} profile picture`}
                src={`/api/v1/portfolios/${w.userId}/profile-picture`}
              />
              <h3 className={styles.txt}>
                {w.name} connected with you
                <p>{dateTimeAgo(w.accepted)}</p>
              </h3>
              <Btn id={w.userId} />
            </div>
          ))}
        </div>
      </AuthenticatedRoute>
    );
  else
    return (
      <AuthenticatedRoute>
        <div>Empty</div>
      </AuthenticatedRoute>
    );
};
