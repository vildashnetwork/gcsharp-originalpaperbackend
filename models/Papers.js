import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    examyear: {
        type: Number,
        required: true,
    },
    examtype: {
        type: String,
        default: "no paper 1 or paper 2",
    },
    department: {
        type: String,
        required: true,
    },
    cloudinaryUrl: {
        type: String,
        required: true,
    },
    cloudinaryPublicId: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
    },
    fileType: {
        type: String,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    uploaderName: {
        type: String,
    },
}, {
    timestamps: true
});

const Paper = mongoose.model('Paper', paperSchema);
export default Paper;