import { Response } from "express";
import { Op } from "sequelize";
import { User } from "../models/user.model.js";
import { UserConnection } from "../models/user-connection.model.js";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";

type UserOnGraph = {
  id: number;
  connections: Set<number>;
};

const visitUsers = async function* (
  start: number
): AsyncIterableIterator<UserOnGraph> {
  // Visit all users using BFS
  const visited = new Set<number>();
  const frontier: UserOnGraph[] = [{ id: start, connections: new Set() }];
  while (frontier.length > 0) {
    // TS complains about possible undefined values from shift even though we
    // check for empty arrays right above. Get your act together Microsoft...
    // @ts-ignore
    const { id } = frontier.shift();
    if (!id) continue;
    if (visited.has(id)) continue;
    visited.add(id);
    const connections = await getConnections(id);
    for (const connection of connections) {
      if (!visited.has(connection)) {
        frontier.push({
          id: connection,
          connections: new Set(),
        });
      }
    }
    // Yield each user immediately, instead of collecting all users in an array
    // and returning them at the end. Yielding early has many benefits, namely:
    // - the client can start rendering recommendations on-the-fly, thus reducing
    //   the time to interactive (TTI) metric
    // - the recommendation engine can terminate early if the client navigates
    //   away from the recommendations page (more concretely, if the socket was
    //   closed), thus saving us compute resources
    // - massive user graphs won't eat up excessive amounts of memory and
    //   potentially crash the server
    // OTOH, we renounce any ability to sort recommendations on the server-side
    // as we can't possibly know if a recommendation with a higher score exists
    // after one that has already been sent off to the client. The consequences
    // of this trade-off are minimised by weighing the geodesic heavily.
    yield { id, connections };
  }
};

const getConnections = async (userId: number) => {
  const rows = await UserConnection.findAll({
    where: {
      accepted: { [Op.not]: null },
      [Op.or]: [{ dstUserId: userId }, { srcUserId: userId }],
    },
  });
  return new Set(
    rows.map(r => (r.srcUserId === userId ? r.dstUserId : r.srcUserId))
  );
};

export const getGraphConnections = async (
  req: ValidatedRequest,
  res: Response
) => {
  const rows = await UserConnection.findAll({
    where: { accepted: { [Op.not]: null } },
  });
  const edges = rows.map(r => ({ source: r.srcUserId, target: r.dstUserId }));
  const userIds: number[] = [];
  for await (const { id } of visitUsers(req.resourceRequesterId ?? 0)) {
    userIds.push(id);
  }
  const nodes = await Promise.all(
    userIds.map(c =>
      User.findByPk(c, {
        attributes: [["userId", "id"], "name", "profilePicture"],
      })
    )
  );

  const links = edges.filter(
    edge => userIds.includes(edge.source) && userIds.includes(edge.target)
  );

  res.status(200).send({ nodes, links });
};
