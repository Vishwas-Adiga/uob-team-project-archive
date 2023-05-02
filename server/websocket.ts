import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { wsClients } from "./main.js";

import queryString from "query-string";
import { AuthConfig } from "./configs/auth.config.js";

interface Payload extends JwtPayload {
  id: number;
  admin: boolean;
}

export default async function (expressServer) {
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: "/socket",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, websocket => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest!.url!.split("?");
      //   console.log(connectionRequest);
      const connectionParams = queryString.parse(params);

      if (!connectionParams.token || Array.isArray(connectionParams.token)) {
        websocketConnection.close();
        websocketConnection.terminate();
        return;
      }
      let userId;
      jwt.verify(
        connectionParams.token,
        AuthConfig.JWT_SECRET,
        async (err, payload: Payload) => {
          if (err) {
            websocketConnection.close();
            websocketConnection.terminate();
            return;
          }
          userId = payload.id;
        }
      );
      wsClients.set(userId, websocketConnection);
      websocketConnection.on("close", function () {
        wsClients.delete(userId);
      });
    }
  );

  return websocketServer;
}
