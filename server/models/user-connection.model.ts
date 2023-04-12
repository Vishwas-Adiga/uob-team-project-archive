import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export class UserConnection extends Model<
  InferAttributes<UserConnection>,
  InferCreationAttributes<UserConnection>
> {
  declare srcUserId: number;
  declare dstUserId: number;
  declare accepted: Date | null;
}

export const init = sequelize =>
  UserConnection.init(
    {
      srcUserId: {
        type: DataTypes.INTEGER,
      },
      dstUserId: {
        type: DataTypes.INTEGER,
      },
      accepted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize }
  );
