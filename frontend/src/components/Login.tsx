import React,  { useState, useEffect } from 'react';
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
    document.title = 'Login / Registration';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend validacija
    if (isRegister) {
      if (!formData.name.trim()) {
        setError('Name is required.');
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required.');
        return;
      }
      if (!formData.password) {
        setError('Password is required.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!formData.email.trim()) {
        setError('Email is required.');
        return;
      }
      if (!formData.password) {
        setError('Password is required.');
        return;
      }
    }

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          // On successful registration, switch to login mode
          setIsRegister(false);
          setError('Registration successful! Please log in now.');
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
          });
        } else {
          // On successful login, store token and navigate
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
    <div className="container">
      <h2>{isRegister ? 'Registration' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          {isRegister && <small className="form-text text-muted">Must be at least 6 characters.</small>}
        </div>
        {isRegister && (
          <div className="mb-3">
            <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button
        type="button"
        className="btn btn-link"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
      </button>
    </div>
  );
};

export default Login;
