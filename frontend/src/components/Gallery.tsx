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
  user?: User; // umetnik
};

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 8; // fiksno 8 po stranici

  useEffect(() => {
    document.title = "Gallery";
    fetchCategories();
    fetchArtworks();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const res = await fetch("http://localhost:8000/api/categories", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setCategories(data);
  };

  // Fetch artworks
  const fetchArtworks = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const res = await fetch("http://localhost:8000/api/artworks", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setArtworks(data.data || []);
  };

  // Pagination change
  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  // Filter artworks by selected category
  const filteredArtworks = selectedCategory
    ? artworks.filter((art) => art.category?.name === selectedCategory)
    : artworks;

  // Determine artworks for current page
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const artworksToShow = filteredArtworks.slice(startIndex, endIndex);

  // Total pages
  const pageCount = Math.ceil(filteredArtworks.length / perPage);

  return (
    <div>
      <h1>Gallery</h1>

      {/* Filter po kategoriji */}
      <div className="filter-container">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // resetuj na prvu stranicu kad filter promeni
          }}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid artworka */}
      <div className="image-grid">
        {artworksToShow.map((art) => (
          <div key={art.id} className="artwork-card">
            {/* Naziv dela – Ime umetnika */}
            <h3>
              {art.naziv} {art.user ? `– ${art.user.name}` : ""}
            </h3>

            <p className="category">{art.category?.name}</p>
            
            <p className="description">{art.opis}</p>
            {/* Slike */}
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

      {/* Pagination */}
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
