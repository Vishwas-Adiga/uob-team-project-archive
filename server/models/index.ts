import pg from "pg";
import { Sequelize } from "sequelize";
import { init } from "./user.model.js";
import { DbConfig } from "../configs/db.config.js";


let db: Sequelize;
if (process.env.NODE_ENV === "production") {
  if (!DbConfig.database || !DbConfig.user || !DbConfig.password) {
    throw new Error("Production mode selected with database undefined: Set the database environment variables")
  }
  db = new Sequelize(
    DbConfig.database,
    DbConfig.user,
    DbConfig.password,
    {
      host: DbConfig.host,
      port: DbConfig.port,
      dialect: "postgres",
      dialectModule: pg,
    }
  )
} else {
  db = new Sequelize("sqlite::memory:")
}

export const sequelize = db;

export const User = init(sequelize);
