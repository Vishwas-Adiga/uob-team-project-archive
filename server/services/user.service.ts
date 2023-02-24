import pg from "pg";
import { DbConfig } from "../configs/db.config.js";
const { Pool, Client } = pg;

const pool = new Pool(DbConfig);

export const getHealth = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT NOW()", (err, res) => {
      resolve([err, res]);
    });
  });
};
