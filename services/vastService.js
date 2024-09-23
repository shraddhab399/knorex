// services/vastService.js
const axios = require('axios');
const xml2js = require('xml2js');
const VAST = require('../models/VAST');

// Function to read XML from URL
exports.readXmlFromUrl = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

// Function to parse XML data
exports.parseXmlData = (xmlContent) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlContent, (err, result) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const vastData = {
                        version: result?.VAST?.$?.version || null,
                        id: result?.VAST?.Ad?.[0]?.$?.id || null,
                        title: result?.VAST?.Ad?.[0]?.InLine?.[0]?.AdTitle?.[0] || null,
                        description: result?.VAST?.Ad?.[0]?.InLine?.[0]?.Description?.[0] || null,
                        impression: {
                            id: result?.VAST?.Ad?.[0]?.InLine?.[0]?.Impression?.[0]?.$?.id || null,
                            url: result?.VAST?.Ad?.[0]?.InLine?.[0]?.Impression?.[0]?._ || null
                        },
                        creatives: result?.VAST?.Ad?.[0]?.InLine?.[0]?.Creatives?.[0]?.Creative?.map(creative => ({
                            companionBanners: creative?.CompanionAds?.[0]?.Companion?.map(banner => ({
                                id: banner?.$?.id || null,
                                width: parseInt(banner?.$?.width) || null,
                                height: parseInt(banner?.$?.height) || null,
                                type: banner?.StaticResource?.[0]?.$?.type || null,
                                source: banner?.StaticResource?.[0]?._ || null,
                                clickThroughUrl: banner?.CompanionClickThrough?.[0] || null
                            })) || [],
                            duration: parseInt(creative?.Linear?.[0]?.Duration?.[0]) || 0, // Use default value of 0 if duration is missing
                            trackingEvents: creative?.Linear?.[0]?.TrackingEvents?.[0]?.Tracking?.map(event => ({
                                type: event?.$?.event || null,
                                url: event?._ || null
                            })) || [],
                            mediaFiles: creative?.Linear?.[0]?.MediaFiles?.[0]?.MediaFile?.map(file => ({
                                type: file?.$?.type || null,
                                bitrate: parseInt(file?.$?.bitrate) || null,
                                width: parseInt(file?.$?.width) || null,
                                height: parseInt(file?.$?.height) || null,
                                source: file?._ || null
                            })) || []
                        })) || []
                    };
                    resolve(vastData);
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
};

// Function to store parsed data in MongoDB
exports.storeParsedData = async (parsedData) => {
    const vastEntry = new VAST(parsedData);
    return vastEntry.save();
};
