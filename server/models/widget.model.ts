import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Announcement } from "./announcement.model.js";
import { Link } from "./link.model.js";
import { Location } from "./location.model.js";
import { Module } from "./module.model.js";
import { RichText } from "./richtext.model.js";
import { User } from "./user.model.js";

type WidgetPayload = Announcement | Link | Location | RichText;
const WidgetTypes = [
  "Announcement",
  "Link",
  "Location",
  "Module",
  "RichText",
] as const;

export class Widget extends Model<
  InferAttributes<Widget>,
  InferCreationAttributes<Widget>
> {
  // Unique integer auto-generated by the db
  declare readonly widgetId: CreationOptional<number>;
  // User who owns the widget
  declare user: ForeignKey<User["userId"]>;

  declare readonly widgetType: (typeof WidgetTypes)[number];
  declare index: number;

  createPayload(
    payload: CreationAttributes<WidgetPayload> | Array<Module["moduleId"]>,
    options?
  ) {
    switch (this.widgetType) {
      case "Module":
        const moduleIds = payload as Array<Module["moduleId"]>;
        return this["setModules"](
          moduleIds.map(id =>
            Module.build({ moduleId: id, name: "", description: "" })
          ),
          options
        );
      default:
        const mixinMethodName = `create${this.widgetType}`;
        return this[mixinMethodName](
          { ...payload, widgetId: this.widgetId },
          options
        );
    }
  }

  async getPayload(
    options?
  ): Promise<
    | WidgetPayload
    | { widgetId: number; modules: Array<Module>; index: number }
    | null
  > {
    options = {
      ...options,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    };
    if (this.widgetType === "Module") {
      const res = await this["getModules"]({
        ...options,
        joinTableAttributes: [],
      });
      return { modules: res, widgetId: this.widgetId, index: this.index };
    }

    const res = (await this[`get${this.widgetType}`](options)).toJSON();
    res["index"] = this.index;
    return res;
  }

  // Association mixins
  declare getOwner: BelongsToGetAssociationMixin<User>;
  declare setOwner: BelongsToSetAssociationMixin<User, number>;
}

export const init = sequelize =>
  Widget.init(
    {
      widgetId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: "widgetIndex",
      },
      widgetType: {
        type: DataTypes.ENUM(...WidgetTypes),
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        unique: "widgetIndex",
        allowNull: false,
      },
    },
    { modelName: "Widget", freezeTableName: true, sequelize }
  );
