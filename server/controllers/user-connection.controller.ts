import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { User, UserConnection } from "../models/index.js";
import { Op } from "sequelize";

export const calculateAllConnections = async (
  userId: number,
  accepted?: boolean
) => {
  const data = await UserConnection.findAll({
    where: {
      [Op.or]: [{ srcUserId: userId }, { dstUserId: userId }],
      accepted: { [accepted ? Op.not : Op.is]: null },
    },
  });
  const allConnections = await Promise.all(
    data.map(d => {
      if (d.srcUserId === userId) {
        return d.getAcceptor();
      } else {
        return d.getInitiator();
      }
    })
  );
  const connectionInfo: Array<any> = allConnections.map((f, i) => {
    return {
      userId: f.userId,
      name: f.name,
      profilePic: f.profilePicture,
      accepted: data[i].accepted,
    };
  });
  return connectionInfo;
};

export const getConnections =
  (accepted?: boolean) => async (req: ValidatedRequest, res: Response) => {
    // if user id doesn't match then you do not have permissions to access connections & requests

    return res
      .status(200)
      .send(await calculateAllConnections(req.resourceRequesterId!, accepted));
  };
export const deleteConnection = async (
  req: ValidatedRequest,
  res: Response
) => {
  await UserConnection.destroy({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { dstUserId: req.resourceRequesterId },
            { srcUserId: req.params.uid },
          ],
        },
        {
          [Op.and]: [
            { srcUserId: req.resourceRequesterId },
            { dstUserId: req.params.uid },
          ],
        },
      ],
    },
  });

  return res.status(200).send();
};

export const updateConnections = async (
  req: ValidatedRequest,
  res: Response
) => {
  const dateTime = new Date();
  const srcUserId = parseInt(req.params.uid, 10);
  const connection = await UserConnection.findOne({
    where: {
      dstUserId: req.resourceRequesterId,
      srcUserId: srcUserId,
    },
  });
  if (!connection) {
    return res.status(403).send();
  }
  await connection.accept();
  return res.status(200).send();
};

export const addConnection = async (req: ValidatedRequest, res: Response) => {
  const signature: string | null = req.body.signature;
  if (signature) {
    const user = await User.findOne({ where: { nfcTag: signature } });
    if (user) {
      await UserConnection.create({
        srcUserId: req.resourceRequesterId,
        dstUserId: user.userId,
        accepted: new Date(),
      });
      return res.status(200).send({ userId: user.userId, name: user.name });
    }
    return res
      .status(400)
      .send({ message: "No user matches the signature provided" });
  }
};

export const requestConnection = async (
  req: ValidatedRequest,
  res: Response
) => {
  const connectionId = parseInt(req.params.uid ?? "0", 10);
  if (connectionId === req.resourceRequesterId) {
    return res.status(400).send({ message: "Cannot connect with self!" });
  }

  await UserConnection.create({
    srcUserId: req.resourceRequesterId,
    dstUserId: connectionId,
  });
  return res.status(200).send();
};
