import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { error } from "console";
import { randomUUID } from "crypto";
import { Hono } from "hono";
import { z } from "zod";

export const app = new Hono();

const createRoomBodySchema = z.object({
  sceneSrc: z.string(),
});

type GameRoom = {
  sceneSrc: string;
};

export const rooms = new Map<string, GameRoom>();

app.post(
  "/room",
  zValidator("json", createRoomBodySchema, (result, ctx) => {
    if (!result.success) {
      return ctx.json({ error: result.error }, 400);
    }
  }),
  async (ctx) => {
    const { sceneSrc } = ctx.req.valid("json");
    const roomId = randomUUID();
    const gameRoom = {
      sceneSrc,
    };
    rooms.set(roomId, gameRoom);
    return ctx.json({ roomId });
  }
);

app.get("/room/:roomId", async (ctx) => {
  const { roomId } = ctx.req.param();
  const gameRoom = rooms.get(roomId);
  if (!gameRoom) {
    return ctx.json({ error: "No room found" }, 400);
  }
  return ctx.json(gameRoom);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
