import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim() === "") {
    throw new ApiError(400, "Name is required");
  }

  const Playlist = await Playlist.create({
    name,
    description: description || "",
    owner: req.user?._id,
  });

  if (!Playlist) {
    throw new ApiError(500, "Error while creating playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "UserID is not valid");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $match: { isPublished: true },
          },
          {
            $project: {
              thumbnail: 1,
              views: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        name: 1,
        description: 1,
        owner: 1,
        thumbnail: 1,
        createdAt: 1,
        updatedAt: 1,
        thumbnail: {
          $first: "$videos.thumbnail",
        },
        videosCount: {
          $size: "videos",
        },
        totalViews: {
          $sum: "$videos.views",
        },
      },
    },
  ]);

  if (!playlists) {
    throw new ApiError(400, "Error while fetching the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError("Invalid playlist Id");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $match: { isPublished: true },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        owner: 1,
        thumbnail: {
          $first: "$videos.thumbnail",
        },
        videosCount: {
          $size: "$videos",
        },
        totalViews: {
          $sum: "$videos.views",
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!playlist.length) {
    throw new ApiError(400, "Error while fetching Playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!playlistId) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You are not authorised to updated the playlist");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }

  const addToPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!addToPlaylist) {
    throw new ApiError(400, "Error while adding video to the playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addToPlaylist,
        "Video added to the playlist successfully"
      )
    );
});

const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id is incorrect");
  }

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Video Id is incorrect");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Playlist.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist?.owner.toString() || req.user?._id.toString()) {
    throw new ApiError(401, "You don't have permission to Perform this action");
  }

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video is not in the playlist");
  }

  const removeVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: {
          $in: [`${videoId}`],
        },
      },
    },
    {
      new: true,
    }
  );

  if (!removeVideo) {
    throw new ApiError(500, "Error while removing video from the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, removeVideo, "Successfully removed the video"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist id is incorrect");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You don't have permission to perform the task");
  }

  const delPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!delPlaylist) {
    throw new ApiError(500, "Error while deleting the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, delPlaylist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist id is incorrect");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You don't have permission to perform the task");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name: name || playlist?.name,
        description: description || playlist?.description,
      },
    },
    {
      new: true,
    }
  );
  if (updatedPlaylist) {
    throw new ApiError(500, "Error while updating the Playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

const getVideoPlaylist = asyncHandler(async (req, req) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $project: {
        name: 1,
        isVideoPresent: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(videoId), "$videos"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
  if (!playlists) {
    throw new ApiError(500, "Error while fetching playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getVideoPlaylist,
};
