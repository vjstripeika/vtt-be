import { describe, it, expect } from "vitest";
import { app } from "./app.js";

const SCENE_IMAGE_URL =
  "https://2minutetabletop.com/wp-content/uploads/2021/11/Forgotten-Monastery-battle-map-Banner-Small.jpg";

const ROOM_PAYLOAD = JSON.stringify({
  sceneSrc: SCENE_IMAGE_URL,
});

describe("Room API", () => {
  it("errors without scene source", async () => {
    const res = await app.request("/room", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.issues.length).toBe(1);
  });

  it("errors without valid scene source", async () => {
    const res = await app.request("/room", {
      method: "POST",
      body: JSON.stringify({
        sceneSrc: "123",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.issues.length).toBe(1);
  });

  it("creates a room", async () => {
    const res = await app.request("/room", {
      method: "POST",
      body: ROOM_PAYLOAD,
      headers: { "Content-Type": "application/json" },
    });

    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.roomId).toBeTypeOf("string");
    expect(body.sceneSrc).toBe(SCENE_IMAGE_URL);
  });

  it("retrieves a created room", async () => {
    const createRes = await app.request("/room", {
      method: "POST",
      body: ROOM_PAYLOAD,
      headers: { "Content-Type": "application/json" },
    });

    const { roomId } = await createRes.json();
    const res = await app.request(`/room/${roomId}`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.roomId).toBeTypeOf("string");
    expect(body.sceneSrc).toBe(SCENE_IMAGE_URL);
  });
});
