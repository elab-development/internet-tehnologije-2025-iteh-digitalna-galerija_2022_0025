import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

type Category = {
  id: number;
  name: string;
};

type Image = {
  id: number;
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

function Profile() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<number | null>(null);
  
  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitMsg, setSubmitMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    document.title = "Profile";
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchArtworks(user.id);
    }
  }, [user]);

  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:8000/api/categories", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setCategories(data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();
    setUser(data);
  };

  const fetchArtworks = async (userId: number) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/artworks/${userId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) return;
    const data = await res.json();
    setArtworks(data);
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

  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files));
  };

  // Funkcija koja popunjava formu za EDIT
  const startEdit = (art: Artwork) => {
    setEditingArtworkId(art.id);
    setNaziv(art.naziv);
    setOpis(art.opis);
    setCategoryId(art.category?.id || "");
    setShowForm(true);
    // Skroluje na vrh stranice gde je forma
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Funkcija za odustajanje od edita/kreiranja
  const cancelAction = () => {
    setShowForm(false);
    setEditingArtworkId(null);
    setNaziv("");
    setOpis("");
    setCategoryId("");
    setImages([]);
  };

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const formData = new FormData();
    formData.append("naziv", naziv);
    formData.append("opis", opis || "");
    formData.append("category_id", String(categoryId));
    images.forEach((f) => formData.append("images[]", f));

    let url = "http://localhost:8000/api/artworks";
    
    // Ako editujemo, menjamo URL i dodajemo _method PUT
    if (editingArtworkId) {
      url = `http://localhost:8000/api/artworks/${editingArtworkId}`;
      formData.append("_method", "PUT");
    }

    const res = await fetch(url, {
      method: "POST", // Uvek POST zbog slanja fajlova (Method Spoofing)
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      setSubmitMsg("Error saving artwork");
      return;
    }

    setSubmitMsg(editingArtworkId ? "Artwork updated 🎉" : "Artwork created 🎉");
    setTimeout(() => setSubmitMsg(""), 5000);
    
    cancelAction(); // Resetuj formu i stanja

    if (user) {
      fetchArtworks(user.id);
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
            <input
              type="text"
              placeholder="Artwork name"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input type="file" multiple onChange={(e) => handleImagesChange(e.target.files)} />
            <button type="submit" className="save-btn">
              {editingArtworkId ? "Update Artwork" : "Save"}
            </button>
          </form>
        )}
      </div>

      <section className="your-artworks">
        <h2>Your artworks</h2>
        {artworks.length === 0 && <p>No artworks yet.</p>}
        <div className="artwork-grid">
          {artworks.map((art) => (
            <div key={art.id} className="artwork-card">
              <h3>{art.naziv}</h3>
              <p className="category">{art.category?.name}</p>
              <p className="description">{art.opis}</p>
              <div className="artwork-images">
                {art.images?.map((img) => (
                  <img
                    key={img.id}
                    src={`http://localhost:8000/storage/${img.file_path}`}
                    alt={art.naziv}
                  />
                ))}
              </div>
              {/* DUGME ZA UPDATE */}
              <button className="update-btn" onClick={() => startEdit(art)}>
                Update artwork
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Profile;