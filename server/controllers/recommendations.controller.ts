/**
 * Recommendation generation engine to suggest users to connect with. The
 * algorithm visits every user in the connection graph using BFS and lists them
 * as a recommendation unless any one of the following is true:
 * - The user is already a connection
 * - The user is a pending connection
 * - The user has a private portfolio
 * Each recommendation is then assigned a similarity score based on the weighted
 * sum of the following:
 * - Number of mutual connections
 * - Number of shared modules
 * - Distance on the graph (graph geodesic)
 * - Euclidean distance between accommodations TODO replace with the L1 norm
 * - Textual similarity in course names
 */
import { Response } from "express";
import { Op } from "sequelize";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { User } from "../models/user.model.js";
import { UserConnection } from "../models/user-connection.model.js";

const FEATURE_WEIGHTS = {
  // Distance on the graph. Weighing this the most heavily allows us to (mostly)
  // sort recommendations by similarity score without having to write additional
  // code to re-order graph results on the client side.
  // Larger the geodesic, lower the score
  GRAPH_GEODESIC: 0.3,
  // Number of mutual users. Weighed as a fraction of the total number of
  // immediate connections (i.e. scored 1 if the recommended user is connected
  // to ALL of this user's connections)
  MUTUAL_USER_COUNT: 0.25,
  SHARED_MODULE_COUNT: 0.05,
  ACCOMMODATION_DISTANCE: 0.2,
  COURSE_NAME_SIMILARITY: 0.2,
} as const;

// We use a scaled Gaussian drop-off function to score the graph geodesic.
// The motivation was to find a continuous function that rewards users closer on
// the user graph with a higher similarity score, whilst also smoothly dropping
// off asymptotically to 0. The Gaussian function centred at x=2 does just that
// and the drop-off factor can be tweaked by changing the standard deviation.
// With the SD set to 2.2, any distance >= 7 is ranked very poorly.
const GEODESIC_SCORE_DROP_OFF = 2.2;
const calculateGeodesicDropoff = (geodesic: number) =>
  // f(x) = exp(-(x - 2) ^ 2 / (2 * GEODESIC_SCORE_DROP_OFF ^ 2))
  // We shift the function by 2 because geodesics 0 and 1 correspond to the user
  // and their existing connections respectively. Meaningful recommendations
  // appear only starting d=3.
  Math.exp(
    -Math.pow(geodesic - 2, 2) / (2 * Math.pow(GEODESIC_SCORE_DROP_OFF, 2))
  );

const calculateSharedModuleCount = async (self: User, other: User) => {
  return 0;
};

const IGNORED_TOKENS = new Set(["with", "a", "in", "an", "the", "and"]);
const PROGRAMME_TYPE_TOKENS = new Set([
  "intercalated",
  "bmedsc",
  "ll.b.",
  "b.a.",
  "b.sc.",
  "m.sci.",
  "m.eng.",
]);
const PROGRAMME_COMMITMENT_TOKENS = new Set(["full-time", "part-time"]);
const TOKEN_TYPE_WEIGHTS = {
  PROGRAMME_TYPE: 0.08,
  PROGRAMME_COMMITMENT: 0.1,
  OTHER: 1 - 0.08 - 0.1,
};
const calculateCourseNameSimilarity = async (self: User, other: User) => {
  const c1 = await self.getCourse();
  const c2 = await other.getCourse();

  if (!c1 || !c2) return 0;

  const intersect = (a, b) => new Set([...a].filter(x => b.has(x)));

  const tokens1 = new Set(
    c1.name
      .toLowerCase()
      .split(" ")
      .filter(t => !IGNORED_TOKENS.has(t))
  );
  const tokens2 = new Set(c2.name.toLowerCase().split(" "));
  const commonTokens = intersect(tokens1, tokens2);
  const commonCommitmentTokens = intersect(
    PROGRAMME_COMMITMENT_TOKENS,
    commonTokens
  );
  const commonTypeTokens = intersect(PROGRAMME_TYPE_TOKENS, commonTokens);
  const otherCommonTokens = new Set(
    [...commonTokens].filter(
      t => !commonTypeTokens.has(t) && !commonCommitmentTokens.has(t)
    )
  );
  const otherSelfTokens = new Set(
    [...tokens1].filter(
      t => !PROGRAMME_TYPE_TOKENS.has(t) && !PROGRAMME_COMMITMENT_TOKENS.has(t)
    )
  );

  const score =
    TOKEN_TYPE_WEIGHTS.PROGRAMME_COMMITMENT * commonCommitmentTokens.size +
    TOKEN_TYPE_WEIGHTS.PROGRAMME_TYPE * commonTypeTokens.size +
    TOKEN_TYPE_WEIGHTS.OTHER * (otherCommonTokens.size / otherSelfTokens.size);

  return score;
};

const RADIUS_EARTH = 6371e3;
const ACCOMM_DISTANCE_DROP_OFF = 4.5;
const calculateAccommodationDistance = async (self: User, other: User) => {
  const accomm1 = await self.getAccommodation();
  const accomm2 = await other.getAccommodation();

  if (!accomm1 || !accomm2) return 0;

  // Convert all to radians
  const lat1 = (accomm1.latitude * Math.PI) / 180;
  const lat2 = (accomm2.latitude * Math.PI) / 180;
  const lon1 = (accomm1.longitude * Math.PI) / 180;
  const lon2 = (accomm2.longitude * Math.PI) / 180;

  const delLat = ((lat2 - lat1) * Math.PI) / 180;
  const delLon = ((lon2 - lon1) * Math.PI) / 180;

  // Using the haversine formula to calculate the great circle distance
  const a =
    Math.pow(Math.sin(delLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(delLon / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = RADIUS_EARTH * c;

  // Score along a Gaussian curve, i.e. lower the distance -> higher the score
  const score = Math.exp(
    -Math.pow(distance, 2) / (2 * Math.pow(ACCOMM_DISTANCE_DROP_OFF, 2))
  );
  return score;
};

const calculateSimilarityScore = async (
  self: User,
  other: User,
  geodesic: number,
  mutualsCount: number,
  connectionsCount: number
) =>
  FEATURE_WEIGHTS.GRAPH_GEODESIC * calculateGeodesicDropoff(geodesic) +
  FEATURE_WEIGHTS.MUTUAL_USER_COUNT * (mutualsCount / connectionsCount) +
  FEATURE_WEIGHTS.SHARED_MODULE_COUNT *
    (await calculateSharedModuleCount(self, other)) +
  FEATURE_WEIGHTS.ACCOMMODATION_DISTANCE *
    (await calculateAccommodationDistance(self, other)) +
  FEATURE_WEIGHTS.COURSE_NAME_SIMILARITY *
    (await calculateCourseNameSimilarity(self, other));

type UserOnGraph = { id: number; geodesic: number; connections: Set<number> };

const visitUsers = async function* (
  start: number
): AsyncIterableIterator<UserOnGraph> {
  // Visit all users using BFS
  const visited = new Set<number>();
  const frontier: UserOnGraph[] = [
    { id: start, geodesic: 0, connections: new Set() },
  ];
  while (frontier.length > 0) {
    // TS complains about possible undefined values from shift even though we
    // check for empty arrays right above. Get your act together Microsoft...
    // @ts-ignore
    const { id, geodesic } = frontier.shift();
    if (!id) continue;
    if (visited.has(id)) continue;
    visited.add(id);
    const connections = await getConnections(id);
    for (const connection of connections) {
      if (!visited.has(connection)) {
        frontier.push({
          id: connection,
          geodesic: geodesic + 1,
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
    yield { id, geodesic, connections };
  }
};

const getConnections = async (userId: number): Promise<Set<number>> => {
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

export const getRecommendations = async (
  req: ValidatedRequest,
  res: Response
) => {
  const self = req.resourceRequesterId;
  const selfAsUser = await User.findByPk(self);
  if (!self || !selfAsUser) return res.status(500).send();
  const reqUserConnections = await getConnections(self);

  for await (const { id, geodesic, connections } of visitUsers(self)) {
    if (reqUserConnections.has(id) || id === self) continue;
    if (connections.has(self)) continue;
    const user = await User.findByPk(id);
    if (!user) continue;
    if (user.privacy === "Private") continue;

    const mutualConnections = Array.from(connections).filter(connection =>
      reqUserConnections.has(connection)
    );

    const similarityScore = Math.trunc(
      (await calculateSimilarityScore(
        selfAsUser,
        user,
        geodesic,
        mutualConnections.length,
        reqUserConnections.size
      )) * 100
    );

    const recommendedUser = {
      userId: id,
      name: user.name,
      course: await user.getCourse({ attributes: ["courseId", "name"] }),
      accommodation: await user.getAccommodation({
        attributes: ["accommId", "name"],
      }),
      mutualConnections,
      similarityScore,
    };
    // Send to the client on-the-fly
    res.write(JSON.stringify(recommendedUser) + "\n");

    // socket.address is undefined if the connection has been closed by the
    // client. No point in continuing if there's nobody on the other side.
    if (!res.socket?.address()) return;
  }
  res.end();
};
