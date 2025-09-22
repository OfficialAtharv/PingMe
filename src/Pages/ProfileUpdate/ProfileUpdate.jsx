import React from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { useState } from 'react'
const ProfileUpdate = () => {
  const [image,setImage]=useState(false);

  return (
    <div className='profile'>
      <div className="profilecontainer">
        <form>
          <h3>Update Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept='.jpg, .png, .pdf, jpeg' hidden />
            <img src={image?URL.createObjectURL(image):assets.avatar_icon} alt="" />
            Upload Profile Image 

          </label>
          <input type="text" placeholder='Your Name' required />
          <textarea placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className="profilepic"src={image? URL.createObjectURL(image):assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
