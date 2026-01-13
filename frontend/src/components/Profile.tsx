import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [message, setMessage] = useState<string>("Učitavanje...");
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchProfile = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Assuming user data is available, or simplify
    setError(false);
    setMessage("Welcome to your profile!");
  };

  useEffect(() => {
    document.title = 'Profile';
    fetchProfile();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('auth_token');
        window.dispatchEvent(new Event("authChange"));
        navigate('/login');
      } else {
        setError(true);
        setMessage("Error during logout.");
      }
    } catch (err) {
      setError(true);
      setMessage("Connection error during logout.");
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      {error ? <p style={{ color: "red" }}>{message}</p> : <p>{message}</p>}

      <div style={{ marginTop: 12 }}>
        <button onClick={logout} style={{ marginRight: 8 }}>Log out</button>
      </div>
    </div>
  );
}

export default Profile;
