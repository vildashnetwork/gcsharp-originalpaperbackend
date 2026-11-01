import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: "android",
        },
        version_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        version_code: {
            type: Number,
            required: true,
            min: 1,
            validate: Number.isSafeInteger,
        },
        play_store_url: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: "app_versions",
    },
);

const AppVersion = mongoose.model("AppVersion", appVersionSchema);
export default AppVersion;
