import React, { useState, useEffect } from 'react';
import '../styles/ExhibitionForm.css';

interface Artwork {
  id: number;
  naziv: string;
  opis: string;
  images: { id: number; image_path: string }[];
}

interface ExhibitionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ExhibitionForm: React.FC<ExhibitionFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artwork_ids: [] as number[],
  });

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUserArtworks();
    }
  }, [isOpen]);

  const fetchUserArtworks = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/artworks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setArtworks(await response.json());
      }
    } catch (err: any) {
      console.error('Greška pri učitavanju artwork-a', err);
    }
  };

  const handleCheckboxChange = (artworkId: number) => {
    setFormData((prev) => {
      const newIds = prev.artwork_ids.includes(artworkId)
        ? prev.artwork_ids.filter((id) => id !== artworkId)
        : [...prev.artwork_ids, artworkId];

      // Maksimalno 3 artwork-a
      if (newIds.length <= 3) {
        return { ...prev, artwork_ids: newIds };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/exhibitions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '', artwork_ids: [] });
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Greška pri kreiranju izložbe. Pokušajte ponovo.');
      }
    } catch (err: any) {
      setError('Greška pri kreiranju izložbe. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kreiraj novu izložbu</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exhibition-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Naziv izložbe *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Npr. Moja letnja kolekcija"
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis izložbe</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Opišite vašu izložbu..."
              maxLength={1000}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Odaberite dela (min 1, max 3) *</label>
            <div className="artwork-selection">
              {artworks.length === 0 ? (
                <p className="no-artworks">
                  Nemate dostupnih dela. Prvo kreirajte barem jedno delo.
                </p>
              ) : (
                artworks.map((artwork) => (
                  <div key={artwork.id} className="artwork-item">
                    <input
                      type="checkbox"
                      id={`artwork-${artwork.id}`}
                      checked={formData.artwork_ids.includes(artwork.id)}
                      onChange={() => handleCheckboxChange(artwork.id)}
                      disabled={
                        formData.artwork_ids.length >= 3 &&
                        !formData.artwork_ids.includes(artwork.id)
                      }
                    />
                    <label htmlFor={`artwork-${artwork.id}`}>
                      <div className="artwork-preview">
                        {artwork.images && artwork.images.length > 0 && (
                          <img
                            src={artwork.images[0].image_path}
                            alt={artwork.naziv}
                          />
                        )}
                      </div>
                      <div className="artwork-info">
                        <div className="artwork-title">{artwork.naziv}</div>
                        <div className="artwork-desc">{artwork.opis}</div>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
            <div className="selection-count">
              Odabrano: {formData.artwork_ids.length}/3
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Otkaži
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={
                loading || formData.artwork_ids.length === 0 || !formData.name
              }
            >
              {loading ? 'Kreiram...' : 'Kreiraj izložbu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExhibitionForm;
