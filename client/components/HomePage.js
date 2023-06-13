import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      return navigate("/");
    }
  
    const token = window.localStorage.getItem("token");
    fetch(`${process.env.URL}/user/get`, {
      headers: {
        Authorization: token, 
      },
    })
      .then((res) => res.json()) 
      .then((data) => {
        if (!data.success) {
          navigate("/");
        }
        setPosts(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home__page">
      <div className="home__navbar">
        <span className="logo">(●'◡'●)</span>
        <ul className="navitems_container">
          <li className="nav__item" onClick={() => navigate("/form")}>
            New Post
          </li>
          <li className="nav__item logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="home__container">
        {posts.data && posts.data.length ? (
          posts.data.map((post) => (
            <div className="post__container" key={post._id}>
              <div className="post__title">{post.title}</div>
              <img src={post.image} alt="" className="post__img" />
              <div className="post__description">{post.description}</div>
            </div>
          ))
        ) : (
          <h1 className="zero__posts">No Posts are available to view</h1>
        )}
      </div>
    </div>
  );
};

export default HomePage;
