import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginManagerProps } from '../models/LoginManagerProps';

const LoginManager: React.FC<LoginManagerProps> = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const user = users.find(user => user.username === username);

    if (!user || user.password !== password) {
      setError('Invalid username or password.');
    } else {
      console.log('Logged in successfully as:', user.username);
      onLoginSuccess(user.username);
      navigate(`/photographer/${user.username}`);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="button-container">
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginManager;
