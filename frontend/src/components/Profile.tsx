import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // ✅ import CSS

type Category = {
  id: number;
  name: string;
};

type User = {
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

  useEffect(() => {
    document.title = "Profile";

    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCategories();
    fetchUser();
  }, []);

  useEffect(() => {
    if (submitMsg) {
      const timer = setTimeout(() => setSubmitMsg(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [submitMsg]);

  const fetchCategories = async () => {
    const token = localStorage.getItem("auth_token");

    const res = await fetch("http://localhost:8000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    setCategories(data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("auth_token");

    const res = await fetch("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    setUser(data);
  };

  const logout = async () => {
    const token = localStorage.getItem("auth_token");

    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("auth_token");
    window.dispatchEvent(new Event("authChange"));
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

    images.forEach((file) => {
      formData.append("images[]", file);
    });

    const res = await fetch("http://localhost:8000/api/artworks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      setSubmitMsg("Error while creating artwork");
      return;
    }

    setSubmitMsg("Artwork successfully created 🎉");

    setNaziv("");
    setOpis("");
    setCategoryId("");
    setImages([]);
    setShowForm(false);
  };

  return (
    <>
      {/* HEADER bez boje */}
      <div className="profile-header">
      <h3>Welcome {user?.name}</h3>

      <div className="logout-container">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>

      <div className="container">
        {submitMsg && <div className="submit-msg">{submitMsg}</div>}

        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create artwork"}
        </button>

        {showForm && (
          <form onSubmit={createArtwork} className="artwork-form">
            <h3>Create new artwork</h3>

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImagesChange(e.target.files)}
            />

            {images.length > 0 && <small>{images.length} image(s) selected</small>}

            <button type="submit" className="save-btn">Save artwork</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Profile;
