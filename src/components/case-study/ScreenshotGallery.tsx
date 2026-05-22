interface GalleryImage { src: string; caption: string; }

interface ScreenshotGalleryProps {
  images: GalleryImage[];
  mobile?: boolean;
}

export default function ScreenshotGallery({ images, mobile = false }: ScreenshotGalleryProps) {
  return (
    <div className={`screenshot-gallery${!mobile ? ' screenshot-gallery--desktop' : ''}`}>
      {images.map(img => (
        <div key={img.caption} className="screenshot-item">
          <div className={`screenshot-item__frame${mobile ? ' screenshot-item__frame--mobile' : ''}`}>
            <img
              src={img.src}
              alt={img.caption}
              className="screenshot-item__img"
              onError={e => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
          </div>
          <span className="screenshot-item__caption">{img.caption}</span>
        </div>
      ))}
    </div>
  );
}
