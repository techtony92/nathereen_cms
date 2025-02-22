import request from "supertest";
import server from "../serverConfiguration.ts";
import { describe, it, expect } from "@jest/globals";
describe("GET /", () => {
    it("Should Return a response object containing a message", async () => {
        const response = await request(server).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ msg: "Request Working" });
    });
});
