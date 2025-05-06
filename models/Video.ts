import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number
    }
}

const videoSchema = new mongoose.Schema<IVideo>({
    title: {
        required: true,
        type: String,
        trim: true

    },
    description: {
        required: true,
        type: String,
        trim: true

    },
    videoUrl: {
        required: true,
        type: String,
        trim: true
    },
    thumbnailUrl: {
        required: true,
        type: String,
    },
    controls: {
        type: Boolean,
        default: true

    },
    transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 }
    }
}, { timestamps: true })

const VideoModel = mongoose.models?.VideoModel || mongoose.model<IVideo>("VideoModel", videoSchema)

export default VideoModel