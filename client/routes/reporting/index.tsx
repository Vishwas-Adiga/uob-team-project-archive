import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedRoute } from "../../components/conditional-route";
import styles from "./style.module.scss";
import { TextInput, Button, TextArea, Select, SelectItem } from "@carbon/react";
import { get, post } from "../../utils/fetch";
import { useData } from "../../utils/use-data";
import { Routes } from "..";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user-state";

export const Reporting = () => {
  const { uid } = useParams<{ uid: string }>();
  const [reportedUser, setReportedName] = useState<string | null>(null);

  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  const [reportTypes] = useData<Array<any>>("report-types", []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await get(`portfolios/${uid}/header`);
        const { name } = await response.json();
        setReportedName(name);
      } catch (error) {
        console.error("Failed", error);
      }
    }

    fetchUser();
  }, [uid]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }
    // const formData = new FormData(formRef.current) as any;
    const body = Object.fromEntries(
      new FormData(formRef.current ?? undefined).entries()
    ) as any;
    console.log(body);
    if (!body.type) {
      // If the formData.type value is empty, show an error message and return
      alert("Please select a reason");
      return;
    }
    try {
      const response = await post(`reports/${uid}`, {
        userId: uid,
        type: parseInt(body.type, 10),
        reason: body.reason,
      });
      if (!response.ok) {
        alert("Report submission failed");
      } else {
        alert("Report created");
        navigate(Routes.PORTFOLIO(user!.userId.toString()));
      }
    } catch (error) {
      console.error("Failed", error);
    }
  };

  return (
    <AuthenticatedRoute>
      <div className={styles.mainCont}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} ref={formRef}>
            <h3>Report a user</h3>
            <div className={styles.nameDate}>
              <img src={`/api/v1/portfolios/${uid}/profile-picture`} />
              <div className={styles.nameName}>
                <TextInput
                  helperText="This is the name of the user you're reporting"
                  id="reportedUser"
                  placeholder={reportedUser}
                  disabled
                />
              </div>
            </div>
            <div className={styles.reason}>
              <Select
                id="report-type"
                name="type"
                helperText="Please select the type of report you wish to submit"
                // defaultItem={reportTypes?.[0]}
                // items={reportTypes ?? []}
                // itemToString={item => item.description}
                defaultValue="placeholder-item"
                required
              >
                <SelectItem
                  disabled
                  hidden
                  value="placeholder-item"
                  text="Select a reason"
                />
                {reportTypes?.map(r => (
                  <SelectItem
                    key={r.typeId}
                    value={r.typeId}
                    text={r.description}
                  />
                ))}
              </Select>

              <TextArea
                id="text-input"
                name="reason"
                helperText="Please provide some additional information for the type of the report"
                required
              />
            </div>
            <div className={styles.submit}>
              <Button kind="primary" type="submit">
                Submit
              </Button>{" "}
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedRoute>
  );
};
