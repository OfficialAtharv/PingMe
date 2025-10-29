import React, { useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { toast } from "react-toastify";
import upload from "../../lib/Upload";

const ProfileUpdate = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [previmg, setPrevimg] = useState("");
  const navigate = useNavigate();

  const profileUpdate = async (event) => {
    event.preventDefault();
    if (!previmg && !image) {
      toast.error("Please upload a profile image");
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      let imgURL = previmg;

      if (image) {
        imgURL = await upload(image);
        setPrevimg(imgURL);
      }

      await updateDoc(docRef, {
        avatar: imgURL,
        name,
        bio,
      });

      toast.success("Profile updated successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docsnap = await getDoc(docRef);
        const data = docsnap.data() || {};

        if (data.name) setName(data.name);
        if (data.bio) setBio(data.bio);
        if (data.avatar) setPrevimg(data.avatar);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <div className="profile">
      <div className="profilecontainer">
        <form onSubmit={profileUpdate}>
          <h3>Update Details</h3>
          <label htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              accept=".jpg,.png,.jpeg,.pdf"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : previmg
                  ? previmg
                  : assets.avatar_icon
              }
              alt="avatar"
            />
            Upload Profile Image
          </label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <button type="submit">Save</button>
        </form>
        <img
          className="profilepic"
          src={image ? URL.createObjectURL(image) : previmg || assets.logo_icon}
          alt="profile"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
