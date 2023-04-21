import pg from "pg";
import { Sequelize } from "sequelize";
import { DbConfig } from "../configs/db.config.js";
import { init as initUser } from "./user.model.js";
import { init as initAccommodation } from "./accommodation.model.js";
import { init as initCourse } from "./course.model.js";
import { init as initLocation } from "./location.model.js";
import { init as initRichtext } from "./richtext.model.js";
import { init as initUserConnection } from "./user-connection.model.js";

let db: Sequelize;
if (process.env.NODE_ENV === "production") {
  if (!DbConfig.database || !DbConfig.user || !DbConfig.password) {
    throw new Error(
      "Production mode selected with database undefined: Set the database environment variables"
    );
  }
  db = new Sequelize(DbConfig.database, DbConfig.user, DbConfig.password, {
    host: DbConfig.host,
    port: DbConfig.port,
    dialect: "postgres",
    dialectModule: pg,
  });
} else {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "dev.db",
  });
}

export const sequelize = db;

export const User = initUser(sequelize);
export const Accommodation = initAccommodation(sequelize);
export const Course = initCourse(sequelize);
export const RichText = initRichtext(sequelize);
export const Location = initLocation(sequelize);
export const UserConnection = initUserConnection(sequelize);

Accommodation.hasMany(User, {
  foreignKey: "accommodation",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
User.belongsTo(Accommodation, { foreignKey: "accommodation" });

Course.hasMany(User, {
  foreignKey: "course",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
User.belongsTo(Course, { foreignKey: "course" });

User.hasMany(RichText, {
  foreignKey: "user",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
  as: "richTextWidgets",
});
RichText.belongsTo(User, { foreignKey: "user", as: "owner" });

User.hasMany(Location, {
  foreignKey: "user",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
  as: "locationWidgets",
});
Location.belongsTo(User, { foreignKey: "user", as: "owner" });

User.hasMany(UserConnection, {
  foreignKey: "srcUserId",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
UserConnection.belongsTo(User, { foreignKey: "srcUserId", as: "initiator" });

User.hasMany(UserConnection, {
  foreignKey: "dstUserId",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
UserConnection.belongsTo(User, { foreignKey: "dstUserId", as: "acceptor" });
