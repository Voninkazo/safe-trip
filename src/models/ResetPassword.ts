import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    token_hash: { type: String, required: true },
    user_id: { type: String, required: true },
    expires_at: { type: Date, required: true }
});

export default mongoose.model('ResetPassword', UserSchema);
