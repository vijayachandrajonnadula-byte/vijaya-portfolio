import Img from './Img';

interface GalleryImage { src: string; caption: string; width?: number; height?: number; }

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
            <Img
              src={img.src}
              alt={img.caption}
              width={img.width}
              height={img.height}
              className="screenshot-item__img"
            />
          </div>
          <span className="screenshot-item__caption">{img.caption}</span>
        </div>
      ))}
    </div>
  );
}
