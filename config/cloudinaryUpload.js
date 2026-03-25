const cloudinary = require("./cloudinary");

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 * Returns empty string if no buffer or if Cloudinary is not configured.
 */
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("image/") ? "image" : "auto";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "todo-app",
        resource_type: resourceType,
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
