import cloudinary from "../utilities/cloudinary.js";


const uploadImage = async (path, folder, index) => {
  console.log(`Uploading image ${index}...`);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result.url);
      }
    );
  });
};

export default uploadImage;