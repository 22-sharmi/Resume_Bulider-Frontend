import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5555/auth/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.username}!</p>
          <img src={user.avatar} alt="User avatar" />
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default HomePage;