interface VideoPreviewProps {
  readonly url: string;
  readonly contentType: string;
}

export function VideoPreview({ url, contentType }: VideoPreviewProps) {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="w-full max-h-[70vh]"
        preload="metadata"
      >
        <source src={url} type={contentType} />
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
