import mongoose from "mongoose";

const pendingSocialSchema = new mongoose.Schema({
        token : { type: String, required: true, unique: true, index : true },
        provider : { type : String, enum : ["google", "github"], required: true },
        providerId : { type: String, required: true },
        email : { type: String, default: null },
        name : { type: String, default: null },
        avatar : { type: String, default: null },

        expiresAt : {
                type : Date,
                required: true,
                index : { expires: 0}
        },
}, { versionKey : false,timestamps: {createdAt: true, updatedAt: false} });

const PendingSocial = mongoose.model("PendingSocial", pendingSocialSchema);

export default PendingSocial; 