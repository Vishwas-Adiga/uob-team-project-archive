import { Sequelize } from "sequelize";
import { init } from "./user.model.js";
import { DbConfig } from "../configs/db.config.js";

export const sequelize = new Sequelize(
  DbConfig.database,
  DbConfig.user,
  DbConfig.password,
  {
    host: DbConfig.host,
    port: DbConfig.port,
    dialect: "postgres",
  }
);

export const User = init(sequelize);
