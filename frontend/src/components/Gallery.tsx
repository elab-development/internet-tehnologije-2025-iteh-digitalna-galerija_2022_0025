import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Pagination from "@mui/material/Pagination";

type Category = { id: number; name: string };
<<<<<<< HEAD
type Image = { id: number; file_path: string };
=======
type Image = { id: string; file_path: string };
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)

type Artwork = {
  id: number;
  naziv: string;
  opis: string;
  category?: Category;
  images?: Image[];
};

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
<<<<<<< HEAD
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const perPage = 6;
=======

  const perPage = 8;
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)

  useEffect(() => {
    document.title = "Gallery";
    fetchCategories();
    fetchArtworks();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8000/api/categories");
<<<<<<< HEAD
    if (res.ok) setCategories(await res.json());
=======
    if (!res.ok) return;
    const data = await res.json();
    setCategories(data);
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
  };

  const fetchArtworks = async () => {
    const res = await fetch("http://localhost:8000/api/artworks");
<<<<<<< HEAD
    if (res.ok) {
      const data = await res.json();
      setArtworks(data.data || []);
    }
=======
    if (!res.ok) return;
    const data = await res.json();
    setArtworks(data.data || []);
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
<<<<<<< HEAD
    window.scrollTo({ top: 0, behavior: "smooth" });
=======
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
  };

  const filteredArtworks = selectedCategory
    ? artworks.filter((art) => art.category?.name === selectedCategory)
    : artworks;

  const startIndex = (currentPage - 1) * perPage;
<<<<<<< HEAD
  const artworksToShow = filteredArtworks.slice(startIndex, startIndex + perPage);
=======
  const endIndex = startIndex + perPage;
  const artworksToShow = filteredArtworks.slice(startIndex, endIndex);

>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
  const pageCount = Math.ceil(filteredArtworks.length / perPage);

  return (
    <div className="gallery-page">
      <h1>Gallery</h1>

<<<<<<< HEAD
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
=======
      <div className="filter-container">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
      </div>

      <div className="image-grid">
        {artworksToShow.map((art) => (
          <div key={art.id} className="artwork-card">
            <h3>{art.naziv}</h3>
<<<<<<< HEAD
            <p className="category-tag">{art.category?.name}</p>
            <p className="description">{art.opis}</p>
            
=======
            <p className="category">{art.category?.name}</p>
            <p className="description">{art.opis}</p>

>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
            <div className="artwork-images">
              {art.images?.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:8000/storage/${img.file_path}`}
                  alt={art.naziv}
                  onClick={() => setPreviewImage(`http://localhost:8000/storage/${img.file_path}`)}
                />
              ))}
            </div>
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