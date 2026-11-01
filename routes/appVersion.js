import { timingSafeEqual } from "node:crypto";
import express from "express";
import AppVersion from "../models/AppVersion.js";

const router = express.Router();

function requireVersionAdminKey(req, res, next) {
    const configuredKey = process.env.APP_VERSION_ADMIN_KEY;
    if (!configuredKey) {
        return res.status(503).json({
            success: false,
            message: "App version administration is not configured",
        });
    }

    const providedKey = req.get("x-admin-key") || "";
    const configuredBuffer = Buffer.from(configuredKey);
    const providedBuffer = Buffer.from(providedKey);
    if (
        configuredBuffer.length !== providedBuffer.length ||
        !timingSafeEqual(configuredBuffer, providedBuffer)
    ) {
        return res.status(403).json({
            success: false,
            message: "Invalid admin key",
        });
    }

    next();
}

function serializeVersion(version) {
    if (!version) return null;

    return {
        version_name: version.version_name,
        version_code: version.version_code,
        play_store_url: version.play_store_url,
        updated_at: version.updatedAt,
    };
}

router.get("/", async (req, res) => {
    try {
        const version = await AppVersion.findById("android").lean();
        return res.status(200).json({
            success: true,
            data: serializeVersion(version),
        });
    } catch (error) {
        console.error("Failed to load app version:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load app version",
        });
    }
});

router.put("/", requireVersionAdminKey, async (req, res) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const versionName =
        typeof body.version_name === "string" ? body.version_name.trim() : "";
    const versionCode = body.version_code;
    const playStoreUrl =
        typeof body.play_store_url === "string" ? body.play_store_url.trim() : "";

    if (!versionName || versionName.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Version name is required and must be 50 characters or fewer",
        });
    }

    if (!Number.isSafeInteger(versionCode) || versionCode < 1) {
        return res.status(400).json({
            success: false,
            message: "Version code must be a positive whole number",
        });
    }

    let parsedPlayStoreUrl;
    try {
        parsedPlayStoreUrl = new URL(playStoreUrl);
    } catch {
        return res.status(400).json({
            success: false,
            message: "Enter a valid Google Play Store URL",
        });
    }

    if (
        parsedPlayStoreUrl.protocol !== "https:" ||
        parsedPlayStoreUrl.hostname !== "play.google.com" ||
        !parsedPlayStoreUrl.pathname.startsWith("/store/apps/")
    ) {
        return res.status(400).json({
            success: false,
            message: "Use a Google Play Store app listing URL",
        });
    }

    try {
        const version = await AppVersion.findByIdAndUpdate(
            "android",
            {
                $set: {
                    version_name: versionName,
                    version_code: versionCode,
                    play_store_url: parsedPlayStoreUrl.toString(),
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            },
        );

        return res.status(200).json({
            success: true,
            message: "App version updated",
            data: serializeVersion(version),
        });
    } catch (error) {
        console.error("Failed to save app version:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save app version",
        });
    }
});

export default router;
