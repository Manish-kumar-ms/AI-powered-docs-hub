// models/Doc.js
import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
  title: {
     type: String,
     required: true
  },
  content: {
     type: String,
     required: true
  },
  summary: {
     type: String,
     required: true
  },
  tags: [{
     type: String,
     required: true
  }],
  embedding: [{
     type: Number,
     required: true
  }],
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true
  }
},{timestamps:true});


const DocModel = mongoose.model("Doc", docSchema);

export default DocModel;
