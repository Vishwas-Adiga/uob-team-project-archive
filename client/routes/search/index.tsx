import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { get } from "../../utils/fetch";
import styles from "./style.module.scss";
import { Button } from "@carbon/react";
import { Routes } from "../index";
import { Helmet } from "react-helmet";

export const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [result, setResult] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searching = async value => {
      const response = await get(`search?query=${value}`);
      const data = await response.json();
      setResult(data);
    };
    searching(searchQuery);
  }, [searchQuery]);

  return (
    <AuthenticatedRoute>
      <div className={styles.container}>
        <Helmet>
          <title>Search results | {Config.APP.NAME}</title>
        </Helmet>
        <h3> Search results for "{searchQuery}"</h3>
        <main id="main-content">
          <ul>
            {result.map(result => (
              <li className={styles.searchResult} key={result.userId}>
                <img
                  className={styles.iconimage}
                  src={`/api/v1/portfolios/${result.userId}/profile-picture`}
                />
                <h4>{result.name}</h4>
                <Button
                  size="sm"
                  onClick={navigate.bind(null, Routes.PORTFOLIO(result.userId))}
                  className={styles.Button}
                >
                  View {Config.APP.NAME}
                </Button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </AuthenticatedRoute>
  );
};
