import { useEffect, useState } from "react";

function Profile() {
  const [message, setMessage] = useState<string>("Učitavanje...");
  const [error, setError] = useState<boolean>(false);

  const fetchProfile = () => {
    fetch("/profile", {
      credentials: "include", // BITNO
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setError(false);
        setMessage(data.message);
      })
      .catch(() => {
        setError(true);
        setMessage("Niste ulogovani");
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const registerDemo = async () => {
    await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Demo User', email: 'demo@example.test', password: 'password' }),
      credentials: 'include',
    });

    fetchProfile();
  };

  const loginDemo = async () => {
    await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@example.test', password: 'password' }),
      credentials: 'include',
    });

    fetchProfile();
  };

  const logout = async () => {
    await fetch('/logout', { method: 'POST', credentials: 'include' });
    fetchProfile();
  };


  return (
    <div className="container">
      <h2>Profile</h2>
      {error ? <p style={{ color: "red" }}>{message}</p> : <p>{message}</p>}

      <div style={{ marginTop: 12 }}>
        <button onClick={registerDemo} style={{ marginRight: 8 }}>Register demo user</button>
        <button onClick={loginDemo} style={{ marginRight: 8 }}>Login demo user</button>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Tip: Use the buttons to register/login a demo user and test the protected endpoint.</p>
    </div>
  );
}

export default Profile;
