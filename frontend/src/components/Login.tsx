import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = isRegister ? 'Registration' : 'Login';
  }, [isRegister]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/register' : '/api/login';
    const body = isRegister
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }
      : {
          email: formData.email,
          password: formData.password
        };

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setIsRegister(false);
          setError('Registration successful! Please log in now.');
          setFormData({ name: '', email: '', password: '', password_confirmation: '' });
        } else {
          localStorage.setItem('auth_token', data.token);
          window.dispatchEvent(new Event("authChange"));
          navigate('/profile');
        }
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('Connection error.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isRegister ? 'Registration' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {isRegister && <small className="form-text">Must be at least 6 characters.</small>}
          </div>

          {isRegister && (
            <div className="auth-input-group">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-main-btn">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;