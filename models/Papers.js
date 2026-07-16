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
}, {
    timestamps: true
});

const Paper = mongoose.model('Paper', paperSchema);
export default Paper;