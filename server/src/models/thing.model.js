import mongoose from "mongoose"

const thingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        thing: {
            type: String,
            required: true,
            maxLength: 500,
            trim: true,
        },
        who: {
            type: String,
            required: true,
            maxLength: 100,
            trim: true,
        },
        why: {
            type: String,
            trim: true,
            maxLength: 1000,
        },
    },
    {
        timestamps: true,
    },
);

const Thing = mongoose.model("Thing", thingSchema)
export default Thing