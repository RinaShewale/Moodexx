const songmodel = require("../model/song.model");
const id3 = require("node-id3");
const storageservice = require("../services/storage.service");

// 🎧 UPLOAD SONG
async function uploadsongs(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Song file is required"
      });
    }

    const songbuffer = req.file.buffer;
    const { mood } = req.body;

    const tags = id3.read(songbuffer);
    const title = tags.title || "Unknown";

    // 🎯 upload audio
    const songFile = await storageservice.uploadFile({
      buffer: songbuffer,
      filename: title + ".mp3",
      folder: "/cohort2/moodify/song"
    });

    // 🎯 poster (FIXED ✅)
    let posterfile = { url: "" };

    if (tags.image && tags.image.imageBuffer) {
      posterfile = await storageservice.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: title + ".jpeg",
        folder: "/cohort2/moodify/poster"
      });
    }

    const song = await songmodel.create({
      title,
      url: songFile.url,
      posterUrl: posterfile.url || "https://via.placeholder.com/300",
      mood
    });

    res.status(201).json({
      message: "song is created successfully",
      song
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
}

// 🎶 GET SONG BY MOOD (RANDOM 🔥)
async function getsong(req, res) {
  try {
    const { mood } = req.query;

    const songs = await songmodel.find({ mood });

    if (songs.length === 0) {
      return res.status(404).json({
        message: "No songs found"
      });
    }

    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    res.status(200).json({
      message: "song fetched successfully",
      song: randomSong
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}

module.exports = {
  uploadsongs,
  getsong
};