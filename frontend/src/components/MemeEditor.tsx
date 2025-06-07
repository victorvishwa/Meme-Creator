import React, { useEffect, useRef } from 'react';

interface MemeEditorProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  topTextSize: number;
  bottomTextSize: number;
  topTextColor: string;
  bottomTextColor: string;
  topTextStroke: string;
  bottomTextStroke: string;
  topTextPosition: number;
  bottomTextPosition: number;
  topTextEffect: string;
  bottomTextEffect: string;
  imageFilter: string;
}

const MemeEditor: React.FC<MemeEditorProps> = ({
  imageUrl,
  topText,
  bottomText,
  topTextSize,
  bottomTextSize,
  topTextColor,
  bottomTextColor,
  topTextStroke,
  bottomTextStroke,
  topTextPosition,
  bottomTextPosition,
  topTextEffect,
  bottomTextEffect,
  imageFilter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply image filter
      ctx.filter = imageFilter;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Reset filter for text
      ctx.filter = 'none';

      // Configure text style
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate text positions based on percentage
      const topY = (canvas.height * topTextPosition) / 100;
      const bottomY = canvas.height - ((canvas.height * bottomTextPosition) / 100);

      // Draw top text
      if (topText) {
        ctx.save();
        ctx.font = `${topTextSize}px Impact`;
        ctx.lineWidth = topTextSize / 20;
        ctx.strokeStyle = topTextStroke;
        ctx.fillStyle = topTextColor;

        // Apply text effect
        if (topTextEffect !== 'none') {
          const [a, b, c, d, e, f] = topTextEffect.split(' ').map(Number);
          ctx.transform(a, b, c, d, e, f);
        }

        ctx.strokeText(topText, canvas.width / 2, topY);
        ctx.fillText(topText, canvas.width / 2, topY);
        ctx.restore();
      }

      // Draw bottom text
      if (bottomText) {
        ctx.save();
        ctx.font = `${bottomTextSize}px Impact`;
        ctx.lineWidth = bottomTextSize / 20;
        ctx.strokeStyle = bottomTextStroke;
        ctx.fillStyle = bottomTextColor;

        // Apply text effect
        if (bottomTextEffect !== 'none') {
          const [a, b, c, d, e, f] = bottomTextEffect.split(' ').map(Number);
          ctx.transform(a, b, c, d, e, f);
        }

        ctx.strokeText(bottomText, canvas.width / 2, bottomY);
        ctx.fillText(bottomText, canvas.width / 2, bottomY);
        ctx.restore();
      }
    };
  }, [
    imageUrl,
    topText,
    bottomText,
    topTextSize,
    bottomTextSize,
    topTextColor,
    bottomTextColor,
    topTextStroke,
    bottomTextStroke,
    topTextPosition,
    bottomTextPosition,
    topTextEffect,
    bottomTextEffect,
    imageFilter,
  ]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ maxHeight: '500px' }}
      />
    </div>
  );
};

export default MemeEditor;
