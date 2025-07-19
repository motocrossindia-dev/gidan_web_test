
import React from 'react';
import video from '../../../src/Assets/video.mp4';

const VideoSection = () => {
  return (
    <div className="flex justify-center mt-8">
      <div className="relative w-full md:w-[1510px] h-[250px] md:h-[500px] ">
        <video
          src={video}
          className="w-full h-full object-cover rounded-lg"
          controls // Adds play, pause, and other video controls
          autoPlay={false} // Remove this if you want to autoplay the video
          muted // Mute the video by default (useful if autoplaying)
        />
      </div>
    </div>
  );
};

export default VideoSection;
