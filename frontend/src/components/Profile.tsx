import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

type Category = { id: number; name: string; };
type Image = { id: number; title: string; file_path: string; };
type Artwork = { id: number; naziv: string; opis: string; category?: Category; images?: Image[]; };
type User = { id: number; name: string; };

function Profile() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<number | null>(null);
  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  // NOVO: Razdvojeni fajlovi i njihovi preview URL-ovi radi lakšeg brisanja
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  
  const [currentImages, setCurrentImages] = useState<Image[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitMsg, setSubmitMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

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

  // Dodavanje novih slika (kumulativno)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...selectedFiles]);

      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setNewPreviews(prev => [...prev, ...urls]);
    }
  };

  // Uklanjanje NOVE slike pre uploada
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    
    // Šaljemo samo preostale nove fajlove
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

    if (res.ok) {
      setSubmitMsg(editingArtworkId ? "Updated 🎉" : "Created 🎉");
      setTimeout(() => setSubmitMsg(""), 5000);
      cancelAction();
      if (user) fetchArtworks(user.id);
    }
  };

  return (
    <>
      <div className="profile-header">
        <h2>Welcome {user?.name}</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="container" style={{ margin: '0 auto' }}>
        {submitMsg && <div className="submit-msg">{submitMsg}</div>}

        <button className="create-btn" onClick={editingArtworkId ? cancelAction : () => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create artwork"}
        </button>

        {showForm && (
          <form className="artwork-form" onSubmit={handleSaveArtwork}>
            <h3>{editingArtworkId ? "Update Artwork" : "New Artwork"}</h3>
            <input type="text" placeholder="Name" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
            <textarea placeholder="Description" value={opis} onChange={(e) => setOpis(e.target.value)} />
            <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required>
              <option value="" disabled hidden>Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <div className="manage-images">
              <p>Artwork Gallery:</p>
              <div className="edit-images-grid">
                {/* STARE SLIKE IZ BAZE */}
                {currentImages.map(img => (
                  <div key={img.id} className={`edit-image-item ${imagesToDelete.includes(img.id) ? 'to-delete' : ''}`}>
                    <img src={`http://localhost:8000/storage/${img.file_path}`} alt="old" />
                    <button type="button" className="x-btn" onClick={() => {
                        setImagesToDelete(prev => prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id]);
                    }}>
                      {imagesToDelete.includes(img.id) ? "↺" : "✕"}
                    </button>
                  </div>
                ))}

                {/* NOVE IZABRANE SLIKE */}
                {newPreviews.map((url, index) => (
                  <div key={index} className="edit-image-item new-preview">
                    <img src={url} alt="new-preview" />
                    <button type="button" className="x-btn" onClick={() => removeNewImage(index)}>✕</button>
                  </div>
                ))}
                
                {/* DUGME ZA DODAVANJE UNUTAR GRID-A (Opciono, ili ostavi klasičan input ispod) */}
                <label className="add-more-box">
                  +
                  <input type="file" multiple onChange={handleFileSelect} hidden />
                </label>
              </div>
            </div>

            <button type="submit" className="save-btn">{editingArtworkId ? "Update" : "Save"}</button>
          </form>
        )}
      </div>

      <section className="your-artworks">
        <h2>Your artworks</h2>
        
        {/* DODATA PROVERA ZA PRAZAN NIZ */}
        {artworks.length === 0 ? (
          <p className="no-artworks-msg">No artworks yet.</p>
        ) : (
          <div className="artwork-grid">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                <h3>{art.naziv}</h3>
                <p className="category">{art.category?.name}</p>
                <div className="artwork-images">
                  {art.images?.map((img) => (
                    <img key={img.id} src={`http://localhost:8000/storage/${img.file_path}`} alt="art" />
                  ))}
                </div>
                <button className="update-btn" onClick={() => startEdit(art)}>Update artwork</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Profile;