import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  const navigate = useNavigate();
  const [prompt,setPrompt] = useState("none")
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleNewPost(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);
    await fetch(`${process.env.URL}/user/post`, {
      method: "POST",
      headers: {
        Authorization: window.localStorage.getItem("token"),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
            setPrompt('success');
            setTimeout(() => {
                navigate('/home')
            },1000)
            return
        }
        setPrompt('failed');
      });
  }

  return (
    <div className="form__container">
        {prompt === "success" && <div className="register__response success">
          ✅Data posted Succesfully
        </div>}
        {prompt === "failed" && <div className="register__response failed">
          ⚠️Error is posting data, please submit all fields
        </div>}
      <div className="preview__img">
        {file ? (
          <img src={URL.createObjectURL(file)} alt="preview image" />
        ) : (
          <span className="preview__label">Preview the Image</span>
        )}
      </div>
      <form
        encType="multipart/form-data"
        className="upload__form"
        method="post"
        onSubmit={handleNewPost}
      >
        <label className="label__title" htmlFor="form__title">
          Title :
          <input
            type="text"
            className="form__title"
            placeholder="Enter Title of your post"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <textarea
          type="text"
          className="form__description"
          placeholder="Please enter your description for this post"
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="upload__file" className="label__file">
          Upload Image :
          <input
            type="file"
            name="image"
            className="upload__file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </label>
        <input type="submit" value="Submit the Post" className="form__submit" />
      </form>
      <button className="back" onClick={() => navigate("/home")}>
        🔙
      </button>
    </div>
  );
};

export default UploadForm;
