import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { response } from "express";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided is does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'temp',
            price: 34
        })
        .expect(404);
});

it('returns a 401 if the provided is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'temp',
            price: 34
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'temp',
            price: 543
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: "new-temp",
            price: 234
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'temp',
            price: 543
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
});

it('update te ticket provided valid input', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'temp',
            price: 543
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
              title: 'new-title',
              price: 100
            })
        .expect(200);
            
});

it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'temp',
            price: 543
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
              title: 'new-title',
              price: 100
            })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

