const mongoose = require('mongoose');

// Companion Banners Schema
const companionBannerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    type: { type: String, required: false }, // type can be null
    source: { type: String, required: true },
    clickThroughUrl: { type: String, required: false }
});

// Tracking Events Schema
const trackingEventSchema = new mongoose.Schema({
    type: { type: String, required: true },
    url: { type: String, required: true }
});

// Media Files Schema
const mediaFileSchema = new mongoose.Schema({
    type: { type: String, required: true },
    bitrate: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    source: { type: String, required: true }
});

// Creative Schema
const creativeSchema = new mongoose.Schema({
    companionBanners: [companionBannerSchema],
    duration: { type: Number, required: false }, // Make duration optional
    trackingEvents: [trackingEventSchema],
    mediaFiles: [mediaFileSchema]
});

// VAST Schema
const vastSchema = new mongoose.Schema({
    version: String,
    id: String,
    title: String,
    description: String,
    impression: {
        id: String,
        url: String
    },
    creatives: [creativeSchema]
});

const VAST = mongoose.model('VAST', vastSchema);
module.exports = VAST;
