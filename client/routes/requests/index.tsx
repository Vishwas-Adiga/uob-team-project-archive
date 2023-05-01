import { AuthenticatedRoute } from "../../components/conditional-route";
import { useEffect, useState } from "react";
import { Connections as ConnectionsState } from "../../state/connections-state";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { del, get, patch } from "../../utils/fetch";
import styles from "./style.module.scss";
import { Button } from "@carbon/react";
import { ArrowLeft, Checkmark, Error } from "@carbon/icons-react";
import { Helmet } from "react-helmet";
import { Config } from "../../config";

export const Requests = () => {
  const [requests, setRequests] = useState<ConnectionsState[]>([]);
  const { pid } = useParams();
  const fetchData = async () => {
    const response = await get(`requests`);
    if (!response.ok) redirect("404");
    const json = await response.json();
    setRequests(json);
  };
  const navigate = useNavigate();
  const navigateToRequests = () => {
    navigate("/connections");
  };
  async function handleConfirmBtn(id: number) {
    await patch(`requests/${id}`);
    fetchData();
  }
  async function handleDeleteBtn(id: number) {
    await del(`requests/${id}`);
    fetchData();
  }
  useEffect(() => {
    fetchData();
  }, [pid]);
  if (requests)
    return (
      <AuthenticatedRoute>
        <div className={styles.container}>
          <Helmet>
            <title>Connection requests | {Config.APP.NAME}</title>
          </Helmet>
          <div className={styles.header}>
            <h3>Connection requests</h3>
            <h4>Accept or delete incoming connection requests</h4>
          </div>
          <Button
            className={styles.btn}
            onClick={navigateToRequests}
            renderIcon={ArrowLeft}
            size="lg"
            kind="ghost"
          >
            Back to connections
          </Button>
          <main id="main-content">
            {requests.map(w => (
              <div className={styles.wrapper} key={w.userId}>
                <img
                  className={styles.img}
                  alt={`${w.name} profile picture`}
                  src={`/api/v1/portfolios/${w.userId}/profile-picture`}
                />
                <h4>{w.name}</h4>
                <Button
                  className={styles.acceptButton}
                  size="md"
                  kind="primary"
                  renderIcon={Checkmark}
                  onClick={handleConfirmBtn.bind(null, w.userId)}
                >
                  Accept
                </Button>
                <Button
                  className={styles.deleteButton}
                  size="md"
                  kind="danger"
                  renderIcon={Error}
                  onClick={handleDeleteBtn.bind(null, w.userId)}
                >
                  Delete
                </Button>
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
