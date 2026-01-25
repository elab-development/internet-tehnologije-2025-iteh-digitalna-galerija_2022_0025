import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExhibitionList.css';

interface Artwork {
  id: number;
  naziv: string;
}

interface Exhibition {
  id: number;
  name: string;
  description: string;
  user: { id: number; name: string };
  artworks: Artwork[];
  created_at: string;
}

const ExhibitionList: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/exhibitions`);
      if (response.ok) {
        setExhibitions(await response.json());
      } else {
        setError('Greška pri učitavanju izložbi.');
      }
    } catch (err: any) {
      setError('Greška pri učitavanju izložbi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading exhibitions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exhibitions-container">
      <h2>All exhibitions</h2>

      {exhibitions.length === 0 ? (
        <p className="no-exhibitions">
          No exibitions available. Be the first to create one!
        </p>
      ) : (
        <div className="exhibitions-grid">
          {exhibitions.map((exhibition) => (
            <div key={exhibition.id} className="exhibition-card">
              <div className="exhibition-header">
                <h3>{exhibition.name}</h3>
                <span className="exhibition-author">
                  by {exhibition.user.name}
                </span>
              </div>

              <p className="exhibition-description">{exhibition.description}</p>

              <div className="exhibition-info">
                <span className="artworks-count">
                  {exhibition.artworks.length} artworks
                </span>
                <span className="created-date">
                  {new Date(exhibition.created_at).toLocaleDateString('sr-RS')}
                </span>
              </div>

              <button
                className="btn-visit"
                onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
              >
                Visit exhibition →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExhibitionList;
