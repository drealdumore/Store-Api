import {Schema, model} from "mongoose";

const cmsSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  coverImage: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CMS = model("Category", cmsSchema);

export default CMS;


// to manage contents like main image on the front page and stuffs