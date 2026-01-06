import React, { useState, useEffect } from 'react';
import './Gallery.css';
import Pagination from '@mui/material/Pagination';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Photo {
    id: number;
    photographer: string;
    src: {
        medium: string;
    };
}

const Gallery: React.FC = () => {
    const [images, setImages] = useState<Photo[]>([]);
    const [likedImages, setLikedImages] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
    const navigate = useNavigate();

    const handlePageChange = (value: number) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`https://api.pexels.com/v1/search?query=artpiece&per_page=8&page=${currentPage}`, {
                    headers: {
                        Authorization: 'f8eLZrQGnyHWu6wQ1DS8CG6IUX9QG6DTm3tgfXjFAnHKmt9U8xkKuZYB'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                setImages(data.photos);
            } catch (error) {
                console.error(error);
            }
        };

        fetchImages();
    }, [currentPage]);

    const handleLikeClick = (id: number) => {
        if (likedImages.includes(id)) {
            setLikedImages(likedImages.filter(imageId => imageId !== id));
        } else {
            setLikedImages([...likedImages, id]);
        }
    };

    const handlePhotographerChange = (event: SelectChangeEvent<string>) => {
        setSelectedPhotographer(event.target.value);
    };

    const uniquePhotographers = Array.from(new Set(images.map(image => image.photographer)));
    const filteredImages = selectedPhotographer
        ? images.filter(image => image.photographer === selectedPhotographer)
        : images;

    const handlePhotographerClick = (photographer: string) => {
        navigate(`/photographer/${photographer}`);
    };

    return (
        <div>
            <h1>Gallery</h1>
            <FormControl variant="outlined" className="form-control">
                <InputLabel id="photographer-label">Photographer</InputLabel>
                <Select
                    labelId="photographer-label"
                    value={selectedPhotographer}
                    onChange={handlePhotographerChange}
                    label="Photographer"
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {uniquePhotographers.map((photographer, index) => (
                        <MenuItem key={index} value={photographer}>
                            {photographer}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className="image-grid">
                {filteredImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.src.medium} alt={image.photographer} />
                        <p onClick={() => handlePhotographerClick(image.photographer)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {image.photographer}
                        </p>
                        <button onClick={() => handleLikeClick(image.id)}>
                            {likedImages.includes(image.id) ? 'Unlike' : 'Like'}
                        </button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <Pagination 
                    count={4} 
                    page={currentPage}
                    onChange={(_, value) => handlePageChange(value)}
                />
            </div>
        </div>
    );
};

export default Gallery;