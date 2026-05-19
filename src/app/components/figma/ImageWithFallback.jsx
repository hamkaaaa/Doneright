export function ImageWithFallback({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}
