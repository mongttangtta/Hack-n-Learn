//자료실 모델
import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
        title : { type: String, required: true , trim: true },
        description : { type: String, default : "" },
        fileUrl : { type: String, required: true },
        fileKey : { type: String, required: true, unique: true },
        fileSize : { type: Number, default : 0 },
        contentType: { type: String },
        uploadedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        }, { timestamps: true }
    );

const Resource = mongoose.model('Resource', ResourceSchema);

export default Resource;