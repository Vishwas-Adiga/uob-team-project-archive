import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Widget } from "./widget.model.js";

export class Link extends Model<
  InferAttributes<Link>,
  InferCreationAttributes<Link>
> {
  // Foreign key that identifies this widget among all widgets of all types
  declare readonly widgetId: ForeignKey<Widget["widgetId"]>;
  // User-defined name of the URL being linked
  declare name: string;
  // URL being linked
  declare url: string;
}

export const init = sequelize =>
  Link.init(
    {
      widgetId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { modelName: "Link", freezeTableName: true, sequelize }
  );
