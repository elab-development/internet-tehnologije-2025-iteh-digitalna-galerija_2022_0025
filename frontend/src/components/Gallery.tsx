import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Pagination from "@mui/material/Pagination";

type Category = { id: number; name: string };
type Image = { id: number; file_path: string };
type User = { id: number; name: string };

type Artwork = {
  id: number;
  naziv: string;
  opis: string;
  category?: Category;
  images?: Image[];
  user?: User;
};

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const perPage = 6;

  useEffect(() => {
    document.title = "Gallery";
    fetchCategories();
    fetchArtworks();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8000/api/categories");
    if (res.ok) setCategories(await res.json());
  };

  const fetchArtworks = async () => {
    const res = await fetch("http://localhost:8000/api/artworks");
    if (res.ok) {
      const data = await res.json();
      setArtworks(data.data || []);
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArtworks = selectedCategory
    ? artworks.filter((art) => art.category?.name === selectedCategory)
    : artworks;

  const startIndex = (currentPage - 1) * perPage;
  const artworksToShow = filteredArtworks.slice(startIndex, startIndex + perPage);
  const pageCount = Math.ceil(filteredArtworks.length / perPage);

  return (
    <div className="gallery-page">
      <h1>Gallery</h1>

      <div className="gallery-filter-section">
        <div className="custom-select-wrapper">
          <select
            className="modern-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <span className="select-arrow">▼</span>
        </div>
      </div>

      <div className="image-grid">
        {artworksToShow.map((art) => (
          <div key={art.id} className="artwork-card">
            <h2>{art.naziv}</h2>
            
            <p className="category-tag">{art.category?.name}</p>
            <p className="description">{art.opis}</p>
            
            <div className="artwork-images">
              {art.images?.map((img) => (
                <div key={img.id} className="image-with-artist">
                  <img
                    src={`http://localhost:8000/storage/${img.file_path}`}
                    alt={art.naziv}
                    onClick={() => setPreviewImage(`http://localhost:8000/storage/${img.file_path}`)}
                  />
                  
                </div>
              ))}
            </div>
            <h3>{art.user?.name}</h3>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="pagination">
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}

      {/* FULLSCREEN PREVIEW - Isto kao na profilu */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Full view" className="image-preview-full" />
        </div>
      )}
    </div>
  );
};

export default Gallery;