import { AuthenticatedRoute } from "../../components/conditional-route";
import { useEffect, useState } from "react";
import { Connections as ConnectionsState } from "../../state/connections-state";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { del, get, patch } from "../../utils/fetch";
import styles from "./style.module.scss";
import { Button } from "@carbon/react";
import { ArrowLeft, Checkmark, Error } from "@carbon/icons-react";

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
        <div>
          <div className={styles.wrapper2}>
            <Button
              className={styles.btn}
              onClick={navigateToRequests}
              renderIcon={() => (
                <ArrowLeft style={{ width: "50px", height: "30px" }} />
              )}
              size="sm"
              kind="ghost"
            >
              {" "}
            </Button>
            <h2 className={styles.reqTitle}>Requests</h2>
          </div>
          {requests.map(w => (
            <div className={styles.wrapper}>
              <img
                className={styles.img}
                alt={`${w.name} profile picture`}
                src={`/api/v1/portfolios/${w.userId}/profile-picture`}
              />
              <h3 className={styles.txt}>{w.name}</h3>
              <Button
                className={styles.btn3}
                size="md"
                kind="secondary"
                renderIcon={Checkmark}
                onClick={handleConfirmBtn.bind(null, w.userId)}
              >
                Confirm
              </Button>
              <Button
                className={styles.btn3}
                size="md"
                kind="danger"
                renderIcon={Error}
                onClick={handleDeleteBtn.bind(null, w.userId)}
              >
                Delete
              </Button>
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
