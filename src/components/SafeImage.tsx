
"use client";

import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

export default function SafeImage({
    src,
    alt,
    className,
    fallback = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    ...props
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            {...props}
            src={imgSrc || fallback}
            alt={alt}
            className={className}
            onError={() => {
                if (imgSrc !== fallback) {
                    setImgSrc(fallback);
                }
            }}
        />
    );
}
