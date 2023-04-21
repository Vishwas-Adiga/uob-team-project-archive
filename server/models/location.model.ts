import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Widget } from "./widget.model.js";

export class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  // Foreign key that identifies this widget among all widgets of all types
  declare readonly widgetId: ForeignKey<Widget["widgetId"]>;
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
        primaryKey: true,
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
