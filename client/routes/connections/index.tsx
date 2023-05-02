import { useEffect, useState } from "react";
import { del, get } from "../../utils/fetch";
import { redirect, useParams, useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import { Connections as ConnectionsState } from "../../state/connections-state";
import { Button } from "@carbon/react";
import { ArrowRight, Information, UserAvatar } from "@carbon/icons-react";
import { AuthenticatedRoute } from "../../components/conditional-route";
import moment from "moment";
import { Config } from "../../config";
import { Helmet } from "react-helmet";
import { Routes } from "..";
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
    async function handleClick(id: number) {
      await del(`connections/${id}`);
      await fetchData();
    }

    return (
      <Button
        className={styles.btn3}
        renderIcon={UserAvatar}
        size="md"
        type="button"
        onClick={handleClick.bind(null, props.id)}
        kind="danger"
      >
        Disconnect
      </Button>
    );
  }

  useEffect(() => {
    fetchData();
  }, [pid]);
  if (connections)
    return (
      <AuthenticatedRoute>
        <div className={styles.container}>
          <Helmet>
            <title>Connections | {Config.APP.NAME}</title>
          </Helmet>
          <div className={styles.header}>
            <h3>Connections</h3>
            <h4>View all your connections and when you connected with them</h4>
          </div>
          <Button
            className={styles.btn4}
            onClick={navigateToRequests}
            renderIcon={ArrowRight}
            size="md"
            kind="ghost"
          >
            View connection requests
          </Button>
          <main id="main-content">
            {connections.map(w => (
              <div className={styles.wrapper} key={w.userId}>
                <img
                  className={styles.img}
                  alt={`${w.name} profile picture`}
                  src={`/api/v1/portfolios/${w.userId}/profile-picture`}
                />
                <h4 className={styles.txt}>
                  <a href={Routes.PORTFOLIO(w.userId.toString())}>
                    {w.name} connected with you
                  </a>
                  <p>{dateTimeAgo(w.accepted)}</p>
                </h4>
                <Btn id={w.userId} />
              </div>
            ))}
          </main>
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
