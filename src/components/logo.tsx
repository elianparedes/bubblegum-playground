import React from "react";

export default function BubblegumLogo({className}: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            width="24"
            height="24"
            viewBox="0 0 300 300"
        >
            <defs>
                <radialGradient
                    id="radial-gradient"
                    cx="0.688"
                    cy="0.274"
                    r="0.505"
                    gradientUnits="objectBoundingBox"
                >
                    <stop offset="0" stopColor="#f3dcff" />
                    <stop offset="0.544" stopColor="#db41be" />
                    <stop offset="1" stopColor="#9d2b7a" />
                </radialGradient>
            </defs>
            <circle
                id="Ellipse_3"
                data-name="Ellipse 3"
                cx="150"
                cy="150"
                r="150"
                fill="url(#radial-gradient)"
            />
        </svg>
    );
}
