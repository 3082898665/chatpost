import mongoose from "mongoose";
import { type } from "os";
const userSchema = new mongoose.Schema({
    id: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ],
    love: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    collect: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    interes: [{
        type: String
    }],
    funs: [{
        type: String
    }
    ],
    getlove: {
        type: Number,
    },
    lovetags: [{
        type: String
    }]
})
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;