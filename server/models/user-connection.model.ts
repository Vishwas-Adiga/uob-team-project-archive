import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { User } from "./user.model.js";

export class UserConnection extends Model<
  InferAttributes<UserConnection>,
  InferCreationAttributes<UserConnection>
> {
  declare srcUserId: ForeignKey<User["userId"]>;
  declare dstUserId: ForeignKey<User["userId"]>;
  declare accepted: Date | null;

  // Association mixin declarations
  declare getInitiator: BelongsToGetAssociationMixin<User>;
  declare getAcceptor: BelongsToGetAssociationMixin<User>;

  /**
   * Marks a connection request as accepted and persists it in the database.
   * Throws an error if the connection was already accepted.
   */
  async accept() {
    if (this.accepted)
      throw new Error("Cannot accept a connection that already exists");
    this.accepted = new Date(Date.now());
    await this.save();
  }
}

export const init = sequelize =>
  UserConnection.init(
    {
      srcUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dstUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accepted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize }
  );
