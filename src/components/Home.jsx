import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <h1>Welcome to Invoice App</h1>
    <Link to="/login"><button>Login</button></Link>
    <Link to="/register"><button>Register</button></Link>
    <a href="https://bluesip-backend.onrender.com/auth/google"><button>Login with Google</button></a>
  </div>
);

export default Home;
