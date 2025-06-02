import mongoose from "mongoose";
import type { User } from "../utils/type";

const UserSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cooperativeName: { type: String, required: true },
  cooperativePhoneNumber: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
