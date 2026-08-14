// import mongoose from 'mongoose';

// const paperSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     examyear: {
//         type: Number,
//         required: true,
//     },
//     examtype: {
//         type: String,
//         default: "no paper 1 or paper 2",
//     },
//     department: {
//         type: String,
//         required: true,
//     },
//     cloudinaryUrl: {
//         type: String,
//         required: true,
//     },
//     cloudinaryPublicId: {
//         type: String,
//         required: true,
//     },
//     fileSize: {
//         type: Number,
//     },
//     fileType: {
//         type: String,
//     },
//     uploadedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     uploaderName: {
//         type: String,
//     },
// }, {
//     timestamps: true
// });

// const Paper = mongoose.model('Paper', paperSchema);
// export default Paper;












import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
    paper_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    paper_number: {
        type: Number,
        required: true,
    },
    pdf_url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    // These fields are needed for the Python backend
    fileSize: {
        type: Number,
        default: 0,
    },
    originalFileSize: {
        type: Number,
        default: 0,
    },
    fileType: {
        type: String,
        default: 'application/pdf',
    },
    uploadedBy: {
        type: String,  // Changed from ObjectId to String to match Python
        default: null,
    },
    uploaderName: {
        type: String,
        default: 'Anonymous',
    },
    downloads: {
        type: Number,
        default: 0,
    },
    // Python backend uses created_at directly from timestamps
}, {
    timestamps: {
        createdAt: 'created_at',  // This matches Python's expected field
        updatedAt: false,
    }
});

// Indexes - keep as-is
paperSchema.index({ paper_id: 1 }, { unique: true });
paperSchema.index({ subject: 1, year: 1, paper_number: 1 });
paperSchema.index({ level: 1 });
paperSchema.index({ uploadedBy: 1 });

const Paper = mongoose.model('Papers', paperSchema);
export default Paper;