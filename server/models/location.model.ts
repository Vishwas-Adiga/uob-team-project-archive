import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Widget } from "./widget.model.js";

export class Location extends Widget<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
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
    { modelName: "Location", freezeTableName: true, sequelize }
  );
