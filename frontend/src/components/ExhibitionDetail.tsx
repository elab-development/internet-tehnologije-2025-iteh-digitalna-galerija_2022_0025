import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ExhibitionDetail.css';

interface Image {
  id: number;
  image_path: string;
}

interface Category {
  id: number;
  naziv: string;
}

interface Artwork {
  id: number;
  naziv: string;
  opis: string;
  images: Image[];
  category: Category;
  user: { id: number; name: string };
}

interface User {
  id: number;
  name: string;
}

interface Exhibition {
  id: number;
  name: string;
  description: string;
  user: User;
  artworks: Artwork[];
  created_at: string;
}

const ExhibitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    fetchExhibition();
  }, [id]);

  const fetchExhibition = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/exhibitions/${id}`);
      if (response.ok) {
        setExhibition(await response.json());
      } else {
        setError('Izložba nije pronađena.');
      }
    } catch (err: any) {
      setError('Izložba nije pronađena.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Učitavam izložbu...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!exhibition) return <div className="error">Izložba nije pronađena.</div>;

  return (
    <div className="exhibition-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Nazad
      </button>

      <div className="exhibition-header-detail">
        <h1>{exhibition.name}</h1>
        <p className="exhibition-author">
          Autор: <strong>{exhibition.user.name}</strong>
        </p>
        <p className="exhibition-date">
          Kreirano: {new Date(exhibition.created_at).toLocaleDateString('sr-RS')}
        </p>
      </div>

      {exhibition.description && (
        <div className="exhibition-description-box">
          <h3>O izložbi</h3>
          <p>{exhibition.description}</p>
        </div>
      )}

      <div className="artworks-container">
        <h2>Dela u izložbi ({exhibition.artworks.length})</h2>

        {exhibition.artworks.length === 0 ? (
          <p className="no-artworks">Ova izložba nema dela.</p>
        ) : (
          <div className="artworks-grid">
            {exhibition.artworks.map((artwork) => (
              <div
                key={artwork.id}
                className={`artwork-card ${
                  selectedArtwork?.id === artwork.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedArtwork(artwork)}
              >
                {artwork.images && artwork.images.length > 0 && (
                  <div className="artwork-image">
                    <img
                      src={artwork.images[0].image_path}
                      alt={artwork.naziv}
                    />
                  </div>
                )}
                <div className="artwork-info">
                  <h3>{artwork.naziv}</h3>
                  <p className="artwork-category">
                    {artwork.category?.naziv}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedArtwork && (
        <div className="artwork-details">
          <h2>Detaljи dela</h2>
          <div className="details-content">
            <div className="details-image">
              {selectedArtwork.images && selectedArtwork.images.length > 0 && (
                <img
                  src={selectedArtwork.images[0].image_path}
                  alt={selectedArtwork.naziv}
                />
              )}
            </div>
            <div className="details-info">
              <h3>{selectedArtwork.naziv}</h3>
              <p className="detail-author">
                <strong>Autor:</strong> {selectedArtwork.user.name}
              </p>
              <p className="detail-category">
                <strong>Kategorija:</strong> {selectedArtwork.category?.naziv}
              </p>
              <div className="detail-description">
                <strong>Opis:</strong>
                <p>{selectedArtwork.opis}</p>
              </div>
              <button
                className="btn-view-artist"
                onClick={() =>
                  navigate(`/photographer/${selectedArtwork.user.id}`)
                }
              >
                Pogledaj fotograerove druge radove →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetail;
