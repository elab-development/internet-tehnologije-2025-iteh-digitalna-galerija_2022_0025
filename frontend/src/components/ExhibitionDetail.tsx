import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ExhibitionDetail.css';

interface Image {
  id: number;
  file_path: string;
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        setError('Exhibition not found.');
      }
    } catch (err: any) {
      setError('Exhibition not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading exhibition...</p></div>;
  if (error) return <div className="no-artworks-msg">{error}</div>;
  if (!exhibition) return <div className="no-artworks-msg">Exhibition not found.</div>;

  return (
    <div className="profile-page">
      <button className="logout-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="profile-header">
        <h2>{exhibition.name}</h2>
        <p>User: <strong>{exhibition.user.name}</strong></p>
        <p>Created: {new Date(exhibition.created_at).toLocaleDateString('sr-RS')}</p>
      </div>

      {exhibition.description && (
        <div className="your-exhibitions">
          <h2>About exhibition</h2>
          <p className='description'>{exhibition.description}</p>
        </div>
      )}

      <div className="your-artworks">
        <h2>Artworks in exhibition ({exhibition.artworks.length})</h2>

        {exhibition.artworks.length === 0 ? (
          <div className="no-artworks-msg">This exhibition has no artworks.</div>
        ) : (
          <div className="artwork-grid">
            {exhibition.artworks.map((artwork) => (
              <div
                key={artwork.id}
                className={`artwork-card ${selectedArtwork?.id === artwork.id ? 'selected' : ''}`}
                onClick={() => setSelectedArtwork(artwork)}
              >
                {artwork.images && artwork.images.length > 0 && (
                  <div className="artwork-images-preview">
                    {artwork.images.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:8000/storage/${image.file_path}`}
                        alt={artwork.naziv}
                        onClick={(e) => {
                          e.stopPropagation(); // ne bi trebalo da selektuje artwork
                          setPreviewImage(`http://localhost:8000/storage/${image.file_path}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                )}
                <div className="category-tag">{artwork.category?.naziv}</div>
                <h3>{artwork.naziv}</h3>
                <p className="description">{artwork.opis}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedArtwork && (
        <div className="your-artworks" style={{ marginTop: '40px' }}>
          <h2>Artwork Details</h2>
          <div className="artwork-images-preview">
            {selectedArtwork.images.map((image) => (
              <img
                key={image.id}
                src={`http://localhost:8000/storage/${image.file_path}`}
                alt={selectedArtwork.naziv}
                onClick={() => setPreviewImage(`http://localhost:8000/storage/${image.file_path}`)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <h3>{selectedArtwork.naziv}</h3>
          <p><strong>User:</strong> {selectedArtwork.user.name}</p>
          <p><strong>Category:</strong> {selectedArtwork.category?.naziv}</p>
          <p>{selectedArtwork.opis}</p>
          <button
            className="create-btn"
            onClick={() => navigate(`/photographer/${selectedArtwork.user.id}`)}
          >
            Look at user's other works →
          </button>
        </div>
      )}

      {/* FULLSCREEN IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetail;
