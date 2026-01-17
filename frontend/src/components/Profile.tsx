import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

<<<<<<< HEAD
type Category = { id: number; name: string; };
type Image = { id: number; title: string; file_path: string; };
type Artwork = { id: number; naziv: string; opis: string; category?: Category; images?: Image[]; };
type User = { id: number; name: string; };
=======
type Category = {
  id: number;
  name: string;
};

type Image = {
  id: number | string;
  title: string;
  file_path: string;
};

type Artwork = {
  id: number;
  naziv: string;
  opis: string;
  category?: Category;
  images?: Image[];
};

type User = {
  id: number;
  name: string;
};
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)

function Profile() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<number | null>(null);
  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<Image[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitMsg, setSubmitMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Profile";
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => { if (user) fetchArtworks(user.id); }, [user]);

  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:8000/api/categories", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    setCategories(await res.json());
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    setUser(await res.json());
  };

  const fetchArtworks = async (userId: number) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/artworks/${userId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (res.ok) setArtworks(await res.json());
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...selectedFiles]);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setNewPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

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
    setShowForm(false);
    setEditingArtworkId(null);
    setNaziv(""); setOpis(""); setCategoryId(""); 
    setNewFiles([]); setNewPreviews([]);
    setImagesToDelete([]); setCurrentImages([]);
  };

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

<<<<<<< HEAD
    if (res.ok) {
      setSubmitMsg(editingArtworkId ? "Updated 🎉" : "Created 🎉");
      setTimeout(() => setSubmitMsg(""), 5000);
      cancelAction();
      if (user) fetchArtworks(user.id);
=======
    if (!res.ok) {
      setSubmitMsg("Greška pri kreiranju rada");
      return;
    }

    
    setSubmitMsg("Rad je kreiran 🎉");

    // sakrij poruku nakon 5 sekundi
    setTimeout(() => {
      setSubmitMsg("");
    }, 5000);
    
    setShowForm(false);
    setNaziv("");
    setOpis("");
    setCategoryId("");
    setImages([]);

    if (user) {
      fetchArtworks(user.id); // refresh artworks nakon kreiranja
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
    }
  };

  const deleteImage = async (imageId: number | string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu sliku?")) {
      return;
    }

    const res = await fetch(`http://localhost:8000/api/images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setSubmitMsg("Greška pri brisanju slike");
      return;
    }

    setSubmitMsg("Slika je uspešno obrisana");
    setTimeout(() => {
      setSubmitMsg("");
    }, 3000);

    if (user) {
      fetchArtworks(user.id);
    }
  };

  const deleteArtwork = async (artworkId: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj rad i sve njegove slike?")) {
      return;
    }

    const res = await fetch(`http://localhost:8000/api/artworks/${artworkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setSubmitMsg("Greška pri brisanju rada");
      return;
    }

    setSubmitMsg("Rad je uspešno obrisan");
    setTimeout(() => {
      setSubmitMsg("");
    }, 3000);

    if (user) {
      fetchArtworks(user.id);
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
      </div>

<<<<<<< HEAD
      <section className="your-artworks">
        <h2>Your Artworks</h2>
        {artworks.length === 0 ? (
          <p className="no-artworks-msg">No artworks yet. Start creating!</p>
        ) : (
          <div className="artwork-grid">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                <h3>{art.naziv}</h3>
                <p className="category-tag">{art.category?.name}</p>
                <p className="description">{art.opis}</p>
                <div className="artwork-images-preview">
                  {art.images?.map((img) => (
                    <img key={img.id} src={`http://localhost:8000/storage/${img.file_path}`} alt="art" 
                    onClick={() => setPreviewImage(`http://localhost:8000/storage/${img.file_path}`)}/>
                    
                  ))}
                </div>
                <button className="update-btn" onClick={() => startEdit(art)}>Update artwork</button>
              </div>
            ))}
          </div>
        )}
=======
     
      {/* YOUR ARTWORKS */}
    <section className="your-artworks">
      <h2>Vaši radovi</h2>

      {artworks.length === 0 && <p>Nema radova još.</p>}

      <div className="artwork-grid">
        {artworks.map((art) => (
          <div key={art.id} className="artwork-card">
            <h3>{art.naziv}</h3>
            <p className="category">{art.category?.name}</p>
            <p className="description">{art.opis}</p>
            <div className="artwork-images">
              {art.images?.map((img) => (
                <div key={img.id} className="image-container">
                  <img
                    src={`http://localhost:8000/storage/${img.file_path}`}
                    alt={art.naziv}
                  />
                  <button
                    className="delete-image-btn"
                    onClick={() => deleteImage(img.id)}
                    title="Obriši sliku"
                  >
                    ✕
                  </button>
                </div>
              ))}
              </div>
            <button
              className="delete-artwork-btn"
              onClick={() => deleteArtwork(art.id)}
            >
              Obriši rad
            </button>
            </div>
          ))}
        </div>
>>>>>>> f88e328 (Izmene u ArtworkController, Artwork modelu i frontend komponentama)
      </section>

      {/* MODALNI PROZOR - POTPUNO IZMEXTEN VAN SVEGA */}
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
                <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required>
                  <option value="" disabled hidden>Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="manage-images-section">
                <label>Gallery Management:</label>
                <div className="edit-images-grid">
                  {currentImages.map(img => (
                    <div key={img.id} className={`edit-image-item ${imagesToDelete.includes(img.id) ? 'marked-delete' : ''}`}>
                      <img src={`http://localhost:8000/storage/${img.file_path}`} alt="old" />
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
                      <button type="button" className="img-action-btn delete" onClick={() => removeNewImage(index)}>✕</button>
                    </div>
                  ))}
                  
                  <label className="add-image-placeholder">
                    <span>+</span>
                    <input type="file" multiple onChange={handleFileSelect} hidden />
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={cancelAction}>Close</button>
                <button type="submit" className="save-btn">{editingArtworkId ? "Update Artwork" : "Save Artwork"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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