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
      fetchArtworks(user.id); // fetch artworks nakon što dobijemo korisnika
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
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files));
  };

  const createArtwork = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const formData = new FormData();
    formData.append("naziv", naziv);
    formData.append("opis", opis);
    formData.append("category_id", String(categoryId));
    images.forEach((f) => formData.append("images[]", f));

    const res = await fetch("http://localhost:8000/api/artworks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      setSubmitMsg("Error creating artwork");
      return;
    }

    setSubmitMsg("Artwork created 🎉");
    setShowForm(false);
    setNaziv("");
    setOpis("");
    setCategoryId("");
    setImages([]);

    if (user) {
      fetchArtworks(user.id); // refresh artworks nakon kreiranja
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="profile-header">
        <h2>Welcome {user?.name}</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* CREATE ARTWORK */}
      <div className="container">
        {submitMsg && <div className="submit-msg">{submitMsg}</div>}

        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create artwork"}
        </button>

        {showForm && (
          <form className="artwork-form" onSubmit={createArtwork}>
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

            <button type="submit" className="save-btn">Save</button>
          </form>
        )}
      </div>

     
      {/* YOUR ARTWORKS */}
    <section className="your-artworks">
      <h2>Your artworks</h2>

      {artworks.length === 0 && <p>No artworks yet.</p>}

      <div className="artwork-grid">
        {artworks.map((art) => (
          <div key={art.id} className="artwork-card">
            <h3>{art.naziv}</h3>
            <p className="category">{art.category?.name}</p>

            <div className="artwork-images">
              {art.images?.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:8000/storage/${img.file_path}`}
                  alt={art.naziv}
                />
              ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Profile;
