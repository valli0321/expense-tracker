import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
    {
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        icon: {
            type: String,
            trim: true,
            default: "",
        },

        amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be positive"],
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Income = mongoose.model("Income", incomeSchema);

export default Income;