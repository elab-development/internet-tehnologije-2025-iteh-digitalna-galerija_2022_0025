import React from 'react';
import '../styles/ExhibitionModal.css';

interface Image {
  id: number;
  file_path?: string;
  image_path?: string;
}

interface Category {
  id: number;
  naziv: string;
}

interface Artwork {
  id: number;
  naziv: string;
  opis: string;
  images?: Image[];
  category?: Category;
}

interface Exhibition {
  id: number;
  name: string;
  description: string;
  artworks: Artwork[];
}

interface ExhibitionModalProps {
  exhibition: Exhibition;
  onClose: () => void;
  onDelete: () => void;
}

const ExhibitionModal: React.FC<ExhibitionModalProps> = ({
  exhibition,
  onClose,
  onDelete,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="exhibition-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{exhibition.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {exhibition.description && (
          <div className="exhibition-description">
            <p>{exhibition.description}</p>
          </div>
        )}

        <div className="exhibition-artworks">
          <h3>Dela u izložbi ({exhibition.artworks.length})</h3>
          <div className="artworks-preview-grid">
            {exhibition.artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-preview-card">
                {artwork.images && artwork.images.length > 0 && (
                  <img src={artwork.images[0].file_path || artwork.images[0].image_path} alt={artwork.naziv} />
                )}
                <div className="artwork-details">
                  <h4>{artwork.naziv}</h4>
                  <p className="category">{artwork.category?.naziv}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-delete" onClick={onDelete}>
            Obriši izložbu
          </button>
          <button className="btn-close" onClick={onClose}>
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionModal;
