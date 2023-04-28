import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../../utils/fetch";
import styles from "./style.module.scss";
import { Button } from "@carbon/react";
import { Routes } from "../index";

export const Search = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const searchQuery = searchParams.get("search");
  const [result, setResult] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searching = async value => {
      const response = await get(`search?query=${value}`);
      const data = await response.json();
      setResult(data);
    };
    searching(searchQuery);
  }, []);

  return (
    <AuthenticatedRoute>
      <>
        <h3> Search Result of: {searchQuery} </h3>
        {result.map(result => (
          <div className={styles.page}>
            <img className={styles.iconimage} src={result.profilePicture} />
            <h4>{result.name}</h4>
            <Button
              kind="primary"
              size="lg"
              onClick={navigate.bind(null, Routes.PORTFOLIO(result.userId))}
              className={styles.Button}
            >
              View Profile
            </Button>
          </div>
        ))}
      </>
    </AuthenticatedRoute>
  );
};
