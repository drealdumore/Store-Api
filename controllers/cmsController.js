import * as factory from "./factoryController.js";
import catchAsync from "../utilities/catchAsync.js";
import CMS from "../models/cmsModel.js"

export const getCMS = factory.getOneWithPopulate(CMS);
export const getAllCategories = factory.getAll(CMS);
export const updateCMS = factory.updateOne(CMS);
export const deleteCMS = factory.deleteOne(CMS);

// export const createCMS = factory.createOne(CMS);
export const createCMS = catchAsync(async (req, res, next) => {
  const {name, description, coverImage}= req.body
  const content= await CMS.create({
    name,
    description,
    coverImage
  });

  res.status(201).json({
    status: "success",
    data: {
      data: content,
    },
  });
});
