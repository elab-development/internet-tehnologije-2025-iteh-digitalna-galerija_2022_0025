import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import { Pagination } from "@mui/material";

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

type Exhibition = {
  id: number;
  name: string;
  description: string;
  user: User;
  artworks: Artwork[];
  created_at: string;
};

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"artworks" | "exhibitions">("artworks");
  const [expandedArtworkId, setExpandedArtworkId] = useState<number | null>(null);

  const perPage = 6;

  useEffect(() => {
    document.title = "Gallery";
    fetchCategories();
    fetchArtworks();
    fetchExhibitions();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/categories");
      if (res.ok) {
        const data = await res.json();
        console.log("Categories loaded:", data);
        setCategories(data);
      } else {
        console.error("Failed to fetch categories:", res.status);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchArtworks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/artworks");
      if (res.ok) {
        const data = await res.json();
        console.log("Artworks loaded:", data);
        setArtworks(data.data || []);
      } else {
        console.error("Failed to fetch artworks:", res.status);
      }
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  const fetchExhibitions = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/exhibitions");
      if (res.ok) setExhibitions(await res.json());
    } catch (err) {
      console.error("Greška pri učitavanju izložbi", err);
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

      {/* TABS */}
      <div className="gallery-tabs">
        <button
          className={`tab-btn ${activeTab === "artworks" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("artworks");
            setCurrentPage(1);
          }}
        >
          Artworks
        </button>
        <button
          className={`tab-btn ${activeTab === "exhibitions" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("exhibitions");
            setCurrentPage(1);
          }}
        >
          Exhibitions ({exhibitions.length})
        </button>
      </div>

      {/* ARTWORKS TAB */}
      {activeTab === "artworks" && (
        <>
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
  {art.images?.slice(0, 4).map((img, index) => (
    <div
      key={img.id}
      className="image-wrapper"
    >
      <img
        src={`http://localhost:8000/storage/${img.file_path}`}
        alt={art.naziv}
        onClick={() => {
          if (index === 3 && art.images && art.images.length > 4) {
            setExpandedArtworkId(art.id);
          } else {
            setPreviewImage(
              `http://localhost:8000/storage/${img.file_path}`
            );
          }
        }}
        className={
          index === 3 && art.images && art.images.length > 4 ? "blurred" : ""
        }
      />

      {index === 3 && art.images && art.images.length > 4 && (
        <div className="overlay" onClick={() => setExpandedArtworkId(art.id)}>
          +{art.images.length - 4}
        </div>
      )}
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
        </>
      )}

      {/* EXHIBITIONS TAB */}
      {activeTab === "exhibitions" && (
        <div className="exhibitions-section">
          {exhibitions.length === 0 ? (
            <p className="no-data">No exhibitions available.</p>
          ) : (
            <div className="exhibitions-grid">
              {exhibitions.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="exhibition-card-gallery"
                  onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                >
                  <div className="exhibition-image">
                    {exhibition.artworks && exhibition.artworks.length > 0 && 
                     exhibition.artworks[0].images && exhibition.artworks[0].images.length > 0 ? (
                      <img
                        src={`http://localhost:8000/storage/${exhibition.artworks[0].images[0].file_path}`}
                        alt={exhibition.name}
                      />
                    ) : (
                      <div className="exhibition-placeholder">📸</div>
                    )}
                  </div>
                  <div className="exhibition-info-card">
                    <h3>{exhibition.name}</h3>
                    <p className="exhibition-author">
                      by {exhibition.user.name}
                    </p>
                    <p className="exhibition-description">{exhibition.description}</p>
                    <div className="exhibition-meta">
                      <span className="artworks-count">
                        {exhibition.artworks.length} artworks
                      </span>
                      <span className="exhibition-date">
                        {new Date(exhibition.created_at).toLocaleDateString('sr-RS')}
                      </span>
                    </div>
                    <button className="btn-visit-exhibition">
                      Visit exhibition →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN PREVIEW */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Full view" className="image-preview-full" />
        </div>
      )}

      {/* EXPANDED IMAGES MODAL */}
      {expandedArtworkId && (
        <div
          className="expanded-images-overlay"
          onClick={() => setExpandedArtworkId(null)}
        >
          <div className="expanded-images-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-expanded-btn"
              onClick={() => setExpandedArtworkId(null)}
            >
              ✕
            </button>
            <div className="expanded-images-grid">
              {artworks
                .find((art) => art.id === expandedArtworkId)
                ?.images?.map((img) => (
                  <img
                    key={img.id}
                    src={`http://localhost:8000/storage/${img.file_path}`}
                    alt="Expanded view"
                    onClick={() =>
                      setPreviewImage(
                        `http://localhost:8000/storage/${img.file_path}`
                      )
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;