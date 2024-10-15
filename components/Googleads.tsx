/* eslint-disable */

// app/components/AdBanner.tsx
'use client';
import { useEffect } from 'react';
import Router from 'next/router';

declare global {
    interface Window {
        adsbygoogle: {
            push: (args: { [key: string]: any }) => void; // Define as a function that takes an object with any keys
        }; 
        adsLoaded?: boolean; // Declare a separate property on window to track if ads are loaded
    }
}

interface AdsBannerProps {
    'data-ad-slot': string;
    'data-ad-format': string;
    'data-full-width-responsive': string;
    'data-ad-layout'?: string;
}

const AdBanner = (props: AdsBannerProps) => {
    useEffect(() => {
        const handleRouteChange = () => {
            const intervalId = setInterval(() => {
                // Check if adsbygoogle exists and ads haven't been loaded yet
                if (window.adsbygoogle && !window.adsLoaded) {
                    window.adsbygoogle.push({}); // This can stay as is, since we defined it to accept any object
                    window.adsLoaded = true; // Mark as loaded after pushing the ad
                    clearInterval(intervalId); // Clear the interval once the ad is loaded
                }
            }, 100);

            return () => clearInterval(intervalId);
        };

        handleRouteChange();

        Router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    return (
        <ins
            className="adsbygoogle adbanner-customize mt-2"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9112160833265609"
            {...props}
        />
    );
};

export default AdBanner;
