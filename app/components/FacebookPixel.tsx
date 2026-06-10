'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const FacebookPixel = ({ pixelId }: { pixelId: string }) => {
    const pathname = usePathname();

    useEffect(() => {
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((pixel) => {
                pixel.init(pixelId);
                pixel.pageView();
            });
    }, [pixelId]);

    useEffect(() => {
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((pixel) => pixel.pageView());
    }, [pathname]);

    return null;
};