
import React from 'react';
import video from '../../../src/Assets/video.mp4';
import { useEffect, useState } from "react";
import axios from "axios";



const VideoSection = () => {

    const [videoData, setVideoData] = useState(null);

useEffect(() => {
  const fetchVideoData = async () => {
    try {
      const res = await axios.get(
        "https://backend.gidan.store/utils/content-blocks/?section=home_screen_video"
      );
      setVideoData(res.data?.[0]);
    } catch (err) {
      console.error(err);
    }
  };

  fetchVideoData();
}, []);


  return (
    <div className="flex justify-center mt-8 mb-8">
      <div className="relative w-full md:w-[1510px] h-[250px] md:h-[500px] ">
  {videoData?.video_link && videoData?.is_active && (
  <iframe
    className="w-full h-full rounded-lg"
    src={videoData.video_link.includes("/shorts/")
      ? videoData.video_link.replace("/shorts/", "/embed/")
      : videoData.video_link.replace("watch?v=", "embed/")}
    title={videoData.title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
)}



      </div>
    </div>
  );
};

export default VideoSection;
