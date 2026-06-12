type Props = {
  videoUrl: string;
  thumbnail?: string;
};

const VideoPlayer = ({ videoUrl, thumbnail }: Props) => {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
        poster={thumbnail}
        controlsList="nodownload"
        preload="metadata"
      />
    </div>
  );
};

export default VideoPlayer;
