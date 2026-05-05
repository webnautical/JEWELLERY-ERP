import React, { useEffect, useRef } from "react";
import lightGallery from "lightgallery";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { imgBaseURL } from "../helper/Utility";

const ImageGallery = ({ attachments = [] , width="44px", height="44px"}) => {
    const galleryRef = useRef(null);
    const lgInstance = useRef(null);

    useEffect(() => {
        if (galleryRef.current && attachments.length > 0) {
            lgInstance.current = lightGallery(galleryRef.current, {
                plugins: [lgThumbnail, lgZoom],
                speed: 300,
                thumbnail: true,
                zoom: true,
                download: true,
            });
        }
        return () => {
            lgInstance.current?.destroy();
        };
    }, [attachments]);

    if (!attachments?.length) return <span style={{ color: "var(--g400)", fontSize: 12 }}>No images</span>;

    return (
        <div ref={galleryRef} style={{ display: "flex", gap: 6, flexWrap: "wrap", zIndex: "999" }}>
            {attachments.map((file) => (
                <a
                    key={file.id}
                    href={`${imgBaseURL()}${file.file_path}`}
                    data-src={`${imgBaseURL()}${file.file_path}`}
                    data-sub-html={`<p>${file.file_name}</p>`}
                >
                    <img
                        src={`${imgBaseURL()}${file.file_path}`}
                        alt={file.file_name}
                        style={{
                            width: width,
                            height: height,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid var(--g200)",
                            cursor: "pointer",
                        }}
                    />
                </a>
            ))}
        </div>
    );
};

export default ImageGallery;