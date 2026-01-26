import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import ExhibitionForm from "./ExhibitionForm";
import ExhibitionModal from "./ExhibitionModal";

// Tipovi podataka - PROMENI Category tip


interface Category {
  id: number;
  naziv: string;
  name?: string;
}

interface Image {
  id: number;
  file_path?: string;
  image_path?: string;
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

interface User {
  id: number;
  name: string;
}

function Profile() {
  const navigate = useNavigate();

  // State za formu i UI
  const [showForm, setShowForm] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<number | null>(null);
  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  // State za slike
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<Image[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  // State za podatke sa servera
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitMsg, setSubmitMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false);

  // State za Exhibition formu
  const [showExhibitionForm, setShowExhibitionForm] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [showExhibitionModal, setShowExhibitionModal] = useState(false);

  // Inicijalno učitavanje
  useEffect(() => {
    document.title = "Profile";
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }
    fetchUser();
    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchArtworks(user.id);
      fetchUserExhibitions();
    }
  }, [user]);

  // API Pozivi - POPRAVI fetchCategories
  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Categories API response:", data); // Debug log
        setCategories(data);
      } else {
        console.error("Failed to fetch categories:", res.status);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (res.ok) setUser(await res.json());
  };

  const fetchArtworks = async (userId: number) => {
    setIsLoadingArtworks(true);
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/artworks/${userId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (res.ok) setArtworks(await res.json());
    setIsLoadingArtworks(false);
  };

  const fetchUserExhibitions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/exhibitions/user", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) setExhibitions(await res.json());
    } catch (err) {
      console.error("Greška pri učitavanju izložbi", err);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    localStorage.removeItem("auth_token");
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    navigate("/login");
  };

  // Upravljanje slikama u formi
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...selectedFiles]);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setNewPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Akcije (Create/Edit/Delete)
  const startEdit = (art: Artwork) => {
    setEditingArtworkId(art.id);
    setNaziv(art.naziv);
    setOpis(art.opis);
    setCategoryId(art.category?.id || "");
    setCurrentImages(art.images || []);
    setImagesToDelete([]);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const cancelAction = () => {
    newPreviews.forEach(url => URL.revokeObjectURL(url));
    setShowForm(false);
    setEditingArtworkId(null);
    setNaziv(""); setOpis(""); setCategoryId("");
    setNewFiles([]); setNewPreviews([]);
    setImagesToDelete([]); setCurrentImages([]);
  };

  // POPRAVI handleSaveArtwork da proveri categoryId
  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validacija
    if (!categoryId) {
      setSubmitMsg("Please select a category");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const formData = new FormData();
    formData.append("naziv", naziv);
    formData.append("opis", opis || "");
    formData.append("category_id", String(categoryId));
    newFiles.forEach((f) => formData.append("images[]", f));

    let url = "http://localhost:8000/api/artworks";
    if (editingArtworkId) {
      url = `${url}/${editingArtworkId}`;
      formData.append("_method", "PUT");
      imagesToDelete.forEach(id => formData.append("delete_images[]", String(id)));
    }

    console.log("Sending artwork data...");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setSubmitMsg(editingArtworkId ? "Artwork updated 🎉" : "Artwork created 🎉");
      cancelAction();
      if (user) fetchArtworks(user.id);
      setTimeout(() => setSubmitMsg(""), 5000);
    } else {
      const errorData = await res.json();
      console.error("Error response:", errorData);
      setSubmitMsg(`Error saving artwork: ${errorData.message || 'Unknown error'}`);
    }
  };

  const deleteArtwork = async (artworkId: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token || !window.confirm("Are you sure you want to delete this artwork and all its images?")) return;

    const res = await fetch(`http://localhost:8000/api/artworks/${artworkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setSubmitMsg("Artwork deleted");
      if (user) fetchArtworks(user.id);
      setTimeout(() => setSubmitMsg(""), 3000);
    }
  };

  const deleteExhibition = async (exhibitionId: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/exhibitions/${exhibitionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSubmitMsg("Exibition deleted");
        fetchUserExhibitions();       // osveži listu izložbi
        setSelectedExhibition(null);   // zatvori modal
        setTimeout(() => setSubmitMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting exhibition", err);
    }
  };


  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Welcome, {user?.name}</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="action-section">
        {submitMsg && <div className="submit-msg">{submitMsg}</div>}
        <button className="create-btn" onClick={() => setShowForm(true)}>
          Create artwork
        </button>
        {artworks.length >= 3 && (
          <button className="create-exhibition-btn" onClick={() => setShowExhibitionForm(true)}>
            Create Your Exhibition
          </button>
        )}
      </div>

      {/* EXHIBITIONS SECTION */}
      {exhibitions.length > 0 && (
        <section className="your-exhibitions">
          <h2>Your Exhibitions ({exhibitions.length})</h2>
          <div className="exhibitions-grid">
            {exhibitions.map((exhibit) => (
              <div key={exhibit.id} className="exhibition-card" onClick={() => {
                setSelectedExhibition(exhibit);
                setShowExhibitionModal(true);
              }}>
                <h3>{exhibit.name}</h3>
                <p className="exhibition-artworks-count">{exhibit.artworks.length} artworks</p>
                {exhibit.description && <p className="exhibition-desc">{exhibit.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="your-artworks">
        <h2>Your Artworks</h2>
        {isLoadingArtworks ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading your artworks...</p>
          </div>
        ) : artworks.length === 0 ? (
          <p className="no-artworks-msg" style={{ textAlign: 'center' }}>No artworks yet. Start creating!</p>
        ) : (
          <div className="artwork-grid">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                <h2>{art.naziv}</h2>
                <p className="category-tag">{art.category?.name || art.category?.naziv}</p>
                <p className="description">{art.opis}</p>

                <div className="artwork-images-preview">
                  {art.images?.map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:8000/storage/${img.file_path || img.image_path}`}
                      alt="art"
                      onClick={() => setPreviewImage(`http://localhost:8000/storage/${img.file_path || img.image_path}`)}
                    />
                  ))}
                </div>

                <div className="card-footer-actions">
                  <button className="update-btn" onClick={() => startEdit(art)}>Edit artwork</button>
                  <button className="delete-artwork-btn" onClick={() => deleteArtwork(art.id)}>Delete artwork</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL FOR NEW/EDIT ARTWORK */}
      {showForm && (
        <div className="modal-overlay" onClick={cancelAction}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="artwork-form" onSubmit={handleSaveArtwork}>
              <h3>{editingArtworkId ? "Edit Artwork" : "New Artwork"}</h3>

              <div className="input-group">
                <input type="text" placeholder="Name of artwork" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
              </div>

              <div className="input-group">
                <textarea placeholder="Tell a story about this piece..." value={opis} onChange={(e) => setOpis(e.target.value)} />
              </div>

              <div className="input-group">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    console.log("Selected category ID:", e.target.value);
                    setCategoryId(Number(e.target.value));
                  }}
                  required
                >
                  <option value="" disabled hidden>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.naziv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="manage-images-section">
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Gallery Management:</label>
                <div className="edit-images-grid">
                  {currentImages.map(img => (
                    <div key={img.id} className={`edit-image-item ${imagesToDelete.includes(img.id) ? 'marked-delete' : ''}`}>
                      <img src={`http://localhost:8000/storage/${img.file_path || img.image_path}`} alt="existing" />
                      <button type="button" className="img-action-btn" onClick={() => {
                        setImagesToDelete(prev => prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id]);
                      }}>
                        {imagesToDelete.includes(img.id) ? "↺" : "✕"}
                      </button>
                    </div>
                  ))}

                  {newPreviews.map((url, index) => (
                    <div key={index} className="edit-image-item new-preview">
                      <img src={url} alt="new-preview" />
                      <button type="button" className="img-action-btn" onClick={() => removeNewImage(index)}>✕</button>
                    </div>
                  ))}

                  <label className="add-image-placeholder">
                    <span>+</span>
                    <input type="file" multiple onChange={handleFileSelect} hidden />
                  </label>
                </div>
                <small className="form-text">Maximum file size per image: 10 MB.</small>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={cancelAction}>Close</button>
                <button type="submit" className="save-btn">{editingArtworkId ? "Update Artwork" : "Save Artwork"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXHIBITION FORM MODAL */}
      {showExhibitionForm && (
        <ExhibitionForm
          isOpen={showExhibitionForm} // kontrola vidljivosti
          onClose={() => setShowExhibitionForm(false)} // zatvaranje
          onSuccess={() => {
            setShowExhibitionForm(false); // zatvori formu
            fetchUserExhibitions();       // osveži izložbe
          }}
        />
      )}






      {/* EXHIBITION DETAIL MODAL */}
      {showExhibitionModal && selectedExhibition && (
        <ExhibitionModal
          exhibition={selectedExhibition}
          onClose={() => {
            setShowExhibitionModal(false);
            setSelectedExhibition(null);
          }}
          onDelete={() => deleteExhibition(selectedExhibition.id)}
        />
      )}

      {/* FULLSCREEN PREVIEW */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="Preview"
            className="image-preview-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;