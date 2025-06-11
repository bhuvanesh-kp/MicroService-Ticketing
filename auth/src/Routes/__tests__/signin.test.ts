import request from "supertest";
import { app } from "../../app";

it("fails when an non existing email is supplied", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(400);
});

it("fails when a incorrect password is supplied", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "mytest@gmail.com",
            password: "NA"
        })
        .expect(400);
});

it("responds with a cookie when valid credentials are given", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});