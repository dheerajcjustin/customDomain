import mongoose from "mongoose";

const workSpaceSchema = new mongoose.Schema(
  {
    subDomain: { type: String, required: true, unique: true }, //work Sapce name
    domain: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    isCoustomDomain: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkSpace = mongoose.model("wrokSpace", workSpaceSchema);

export default WorkSpace;
