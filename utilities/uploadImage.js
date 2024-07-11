import cloudinary from "../utilities/cloudinary.js";
import AppError from "../utilities/appError.js";

const uploadImage = async (path, folder, index) => {
  console.log(`Uploading image ${index}...`);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) reject(new AppError("Error uploading image", 500));
        resolve(result);
        // resolve(result.url);
      }
    );
  });
};

export default uploadImage;