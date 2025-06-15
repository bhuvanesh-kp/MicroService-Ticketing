import mongoose from "mongoose";

interface PaymentsAttributes {
    orderId: string;
    stripeId: string;
}

interface PyamentDocument extends mongoose.Document {
    orderId: string;
    stripeId: string;
    version: number;
}

interface PaymentModel extends mongoose.Model<PyamentDocument> {
    build(attributes: PaymentsAttributes): PyamentDocument;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        required: true,
        type: String,
    },
    stripeId: {
        required: true,
        type: String
    }
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

paymentSchema.statics.build = (attributes: PaymentsAttributes) => {
    return new Payment(attributes);
}

const Payment = mongoose.model<PyamentDocument, PaymentModel>(
    'Payment',
    paymentSchema
);

export { Payment };