import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PhotographerPage.css';

const PhotographerPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [images, setImages] = useState<any[]>([]);
    const [filteredImages, setFilteredImages] = useState<any[]>([]);
    const apiKey = '1015df66-245f-46fc-b32a-11d406911363'; 

    useEffect(() => {
        console.log(`Fetching images for photographer: ${name}`);
        const fetchImages = async () => {
            try {
                const response = await fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                console.log('Fetched images:', data.records);
                setImages(data.records);
            } catch (error) {
                console.error(error);
            }
        };

        fetchImages();
    }, [name, apiKey]);

    useEffect(() => {
        if (name && images.length > 0) {
            setFilteredImages(images.slice(0, 6)); 
        }
    }, [name, images]);

    return (
        <div>
            <h1>Posts by {name}</h1>
            <div className="photographer-image-grid">
                {filteredImages.map((image, index) => (
                    <div key={index} className="photographer-image-card">
                        <img src={image.primaryimageurl} alt={image.title} />
                        <p>{image.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotographerPage;
