import React, { useState, useEffect } from 'react';
import '../styles/ExhibitionForm.css';

interface Artwork {
  id: number;
  naziv: string;
  opis: string;
  images: Array<{ id: number; file_path: string; image_path?: string }>;
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
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserArtworks();
    }
  }, [isOpen]);

 
  const fetchUserArtworks = async () => {
    try {
      setIsFetching(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('You are not logged in');
        return;
      }

   
      const response = await fetch(`http://localhost:8000/api/artworks/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("User artworks fetched:", data);
        
        // Provera da li je odgovor niz ili objekat sa data svojstvom
        const artworksArray = Array.isArray(data) ? data : (data.data ? data.data : []);
        console.log("Artworks array:", artworksArray);
        
        setArtworks(artworksArray);
      } else {
        console.error('API Error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        setError(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error('Error loading artworks', err);
      setError('Cannot load your artworks. Please check your connection.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCheckboxChange = (artworkId: number) => {
    setFormData((prev) => {
      const newIds = prev.artwork_ids.includes(artworkId)
        ? prev.artwork_ids.filter((id) => id !== artworkId)
        : [...prev.artwork_ids, artworkId];

      // Maximum 3 artworks
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

    // Validation
    if (formData.artwork_ids.length === 0) {
      setError('You must select at least one artwork for the exhibition');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Exhibition name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('You are not logged in');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/exhibitions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Exhibition created:", result);
        
        setFormData({ name: '', description: '', artwork_ids: [] });
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        setError(errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError('Error creating exhibition. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay exhibition-modal-overlay" onClick={onClose}>
      <div className="modal-content exhibition-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Exhibition</h2>
          <button className="close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exhibition-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Exhibition Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. My Summer Collection"
              required
              maxLength={255}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Exhibition Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe your exhibition..."
              maxLength={1000}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Select Artworks (min 1, max 3) *</label>
            
            {isFetching ? (
              <div className="loading-state">Loading your artworks...</div>
            ) : artworks.length === 0 ? (
              <div className="no-artworks-message">
                <p>You don't have any available artworks. Create at least one artwork first.</p>
              </div>
            ) : (
              <>
                <div className="artwork-selection">
                  {artworks.map((artwork) => (
                    <div key={artwork.id} className="artwork-item">
                      <input
                        type="checkbox"
                        id={`artwork-${artwork.id}`}
                        checked={formData.artwork_ids.includes(artwork.id)}
                        onChange={() => handleCheckboxChange(artwork.id)}
                        disabled={
                          (formData.artwork_ids.length >= 3 &&
                          !formData.artwork_ids.includes(artwork.id)) || loading
                        }
                      />
                      <label htmlFor={`artwork-${artwork.id}`} className="artwork-label">
                        <div className="artwork-preview">
                          {artwork.images && artwork.images.length > 0 && (
                            <img
                              src={`http://localhost:8000/storage/${artwork.images[0].file_path || artwork.images[0].image_path}`}
                              alt={artwork.naziv}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                              }}
                            />
                          )}
                        </div>
                        <div className="artwork-info">
                          <div className="artwork-title">{artwork.naziv}</div>
                          <div className="artwork-desc">{artwork.opis.substring(0, 100)}...</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="selection-count">
                  Selected: {formData.artwork_ids.length}/3
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={
                loading || 
                formData.artwork_ids.length === 0 || 
                !formData.name.trim() ||
                isFetching
              }
            >
              {loading ? 'Creating...' : 'Create Exhibition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExhibitionForm;