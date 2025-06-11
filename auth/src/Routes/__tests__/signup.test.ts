import request from "supertest";
import { app } from "../../app";

it("return a 201 statusCode on sucessful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(201);
});

it("return a 400 statusCode on invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "invalid-mail-id",
            password: "temp-password"
        })
        .expect(400);
});

it("return a 400 statusCode on invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "invalid-mail-id",
            password: "NA"
        })
        .expect(400);
});

it("return a 400 statusCode on invalid password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "valid@gmail.com",
        })
        .expect(400);

    await request(app)
        .post("/api/users/signup")
        .send({
            password: "password"
        })
        .expect(400);
});

it("disallows duplicate signups", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(400);
});

it("sets up cookies after a sucessfull signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "mytest@gmail.com",
            password: "temp-password"
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})