import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicates per user
categorySchema.index(
  { userId: 1, name: 1, type: 1 },
  { unique: true }
);

export default mongoose.model("Category", categorySchema);