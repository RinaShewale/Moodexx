const mongoose = require("mongoose")

const songschema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    default: "Unknown Artist"
  },
  mood: {
    type: String,
    enum: ["sad", "happy", "surprised","angry"],
    required: true,
    default: "happy"
  }
}, { timestamps: true })

const songmodel = mongoose.model("songs", songschema)

module.exports = songmodel