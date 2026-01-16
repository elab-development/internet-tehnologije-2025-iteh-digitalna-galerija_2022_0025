import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Pagination from "@mui/material/Pagination";

type Category = {
  id: number;
  name: string;
};

type Image = {
  id: number;
  file_path: string;
};

type Artwork = {
  id: number;
  naziv: string;
  opis: string;
  category?: Category;
  images?: Image[];
};

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const perPage = 8; // fiksno 8 po stranici

  useEffect(() => {
    document.title = "Gallery";
    fetchCategories();
    fetchArtworks();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const res = await fetch("http://localhost:8000/api/categories", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setCategories(data);
  };

  const fetchArtworks = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const res = await fetch("http://localhost:8000/api/artworks", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setArtworks(data.data || []);
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  // filtrirani artwork-i
  const filteredArtworks = selectedCategory
    ? artworks.filter((art) => art.category?.name === selectedCategory)
    : artworks;

  // artwork-i za trenutnu stranicu
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const artworksToShow = filteredArtworks.slice(startIndex, endIndex);

  // broj stranica fiksno prema ukupnom broju filtriranih artworka
  const pageCount = Math.ceil(filteredArtworks.length / perPage);

  return (
    <div>
      <h1>Gallery</h1>

      {/* FILTER PO KATEGORIJI */}
      <div className="filter-container">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* GRID ARTWORKA */}
      <div className="image-grid">
        {artworksToShow.map((art) => (
          <div key={art.id} className="artwork-card">
            <h3>{art.naziv}</h3>
            <p className="category">{art.category?.name}</p>
            <p className="description">{art.opis}</p>
            <div className="artwork-images">
              {art.images?.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:8000/storage/${img.file_path}`}
                  alt={art.naziv}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIJA */}
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
    </div>
  );
};

export default Gallery;
