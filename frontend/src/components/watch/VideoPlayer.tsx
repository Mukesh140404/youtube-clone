import { addviewApi } from "@/client/view.api";
import { useState } from "react";
type Props = {
  videoUrl: string;
  videoId: string;
  thumbnail?: string;
};

const VideoPlayer = ({ videoUrl, thumbnail, videoId }: Props) => {

  const [isApicalled, setIsApiCalled] = useState(false);
  const handleTimeUpdate = async (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;

    const percentage = (video.currentTime / video.duration) * 100;

    if (percentage > 90) {
      if (!isApicalled) {
        await addviewApi(videoId);
        setIsApiCalled(true);
      }
    }

  };

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        controlsList="nodownload"
        preload="metadata"
      />
    </div>
  );
};

export default VideoPlayer;
