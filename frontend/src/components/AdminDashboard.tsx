import SalesChart from './SalesChart';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

type Statistics = {
  totalUsers: number;
  adminUsers: number;
  guestUsers: number;
  totalArtworks: number;
  totalImages: number;
  artworksByCategory: Array<{ id: number; name: string; count: number }>;
  topCategories: Array<{ name: string; count: number }>;
  topArtists: Array<{ name: string; artworks_count: number }>;
  timestamp: string;
};

function AdminDashboard() {
  const navigate = useNavigate();
  
  // PRVO - proveravamo autentifikaciju PRE nego što inicijalizujemo komponente
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");
  
  // Ako nema autentifikacije, odmah se vraćamo null
  if (!token || userRole !== "admin") {
    // Preusmerite u background-u
    if (!token) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
    return null;
  }

  // Tek sada možemo nastaviti sa komponentom jer smo sigurni da je admin
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin Dashboard";
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const res = await fetch("http://localhost:8000/api/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError("You do not have access to the admin panel");
          navigate("/profile");
        } else {
          setError("Error loading statistics");
        }
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError("Error communicating with the server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && stats) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Panel</h1>
          <p className="timestamp">
            Updated: {new Date(stats.timestamp).toLocaleString("en-US")}
          </p>
        </div>

      {/* Main statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>Administrators</h3>
            <p className="stat-number">{stats.adminUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <h3>Total artworks</h3>
            <p className="stat-number">{stats.totalArtworks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-content">
            <h3>Total images</h3>
            <p className="stat-number">{stats.totalImages}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎭</div>
          <div className="stat-content">
            <h3>Guest users</h3>
            <p className="stat-number">{stats.guestUsers}</p>
          </div>
        </div>
      </section>

      {/* Chart vizualizacija */}
      <section className="dashboard-section full-width" style={{ maxWidth: 700, margin: '40px auto' }}>
        <SalesChart />
      </section>
      {/* Two rows with details */}
      <div className="dashboard-row">
        {/* Top categories */}
        <section className="dashboard-section">
          <h2>🏆 Most popular categories</h2>
          <div className="category-list">
            {stats.topCategories && stats.topCategories.length > 0 ? (
              stats.topCategories.map((cat, idx) => (
                <div key={idx} className="category-item">
                  <div className="category-rank">#{idx + 1}</div>
                  <div className="category-bar-wrapper">
                    <p className="category-name">{cat.name}</p>
                    <div className="category-bar">
                      <div
                        className="category-fill"
                        style={{
                          width: `${
                            (cat.count /
                              (stats.topCategories[0]?.count || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="category-count">{cat.count} artworks</p>
                </div>
              ))
            ) : (
              <p className="no-data">No categories</p>
            )}
          </div>
        </section>

        {/* Top artists */}
        <section className="dashboard-section">
          <h2>⭐ Artists with the most artworks</h2>
          <div className="artists-list">
            {stats.topArtists && stats.topArtists.length > 0 ? (
              stats.topArtists.map((artist, idx) => (
                <div key={idx} className="artist-item">
                  <div className="artist-rank">#{idx + 1}</div>
                  <div className="artist-info">
                    <p className="artist-name">{artist.name}</p>
                    <p className="artist-count">
                      {artist.artworks_count} artworks
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No artists</p>
            )}
          </div>
        </section>
      </div>

      {/* All categories with artwork count */}
      <section className="dashboard-section full-width">
        <h2>📊 Category details</h2>
        <div className="categories-table">
          <div className="table-header">
            <p>Category</p>
            <p>Number of artworks</p>
          </div>
          {stats.artworksByCategory && stats.artworksByCategory.length > 0 ? (
            stats.artworksByCategory.map((cat) => (
              <div key={cat.id} className="table-row">
                <p>{cat.name}</p>
                <p className="count-badge">{cat.count}</p>
              </div>
            ))
          ) : (
            <p className="no-data">No categories</p>
          )}
        </div>
      </section>
    </div>
  );
  }

  // If loading or no error
  return (
    <div className="admin-dashboard">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
