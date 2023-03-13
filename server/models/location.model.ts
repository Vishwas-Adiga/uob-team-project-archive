import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { User } from "./user.model.js";

export class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  // Unique integer auto-generated by the db
  declare widgetId: CreationOptional<number>;
  // User who owns the widget
  declare user: User;
  // Latitude (decimal degrees)
  declare latitude: number;
  // Longitude (decimal degrees)
  declare longitude: number;
  // Title
  declare title: string;
  // Description
  declare description: string;
}

export const init = sequelize =>
  Location.init(
    {
      widgetId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    { sequelize }
  );
