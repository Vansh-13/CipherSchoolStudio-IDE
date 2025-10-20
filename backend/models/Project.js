import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { type: String, required: true },
    structure: [
      {
        type: { type: String, enum: ["file", "folder"], required: true },
        name: { type: String, required: true },
        path: { type: String, required: true },
        code: { type: String }, 
        children: [] 
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
