export default function (imageUrls: string | string[]) {
  const imagesToLoad = [...imageUrls];

  if (imageUrls.length === 0) {
    throw new Error('Image URL is required');
  }

  for (const imageUrl of imagesToLoad) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      img.remove();
    };
  }
}
