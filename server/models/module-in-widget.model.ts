import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Module } from "./module.model.js";
import { Widget } from "./widget.model.js";

export class ModuleInWidget extends Model<
  InferAttributes<ModuleInWidget>,
  InferCreationAttributes<ModuleInWidget>
> {
  // Module
  declare moduleId: ForeignKey<Module["moduleId"]>;
  // Widget
  declare widgetId: ForeignKey<Widget["widgetId"]>;
}

export const init = sequelize =>
  ModuleInWidget.init(
    {
      moduleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      widgetId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    { modelName: "ModuleInWidget", freezeTableName: true, sequelize }
  );
