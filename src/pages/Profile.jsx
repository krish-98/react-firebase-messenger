import React, { useEffect, useState } from "react"
import Camera from "../components/svg/Camera"
import Img from "../images/image1.jpg"
import { auth, db, storage } from "../firebase"
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const Profile = () => {
  const [img, setImg] = useState("")
  const [user, setUser] = useState()

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
      }
    })

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        )
        try {
          const snap = await uploadBytes(imgRef, img)
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          })

          setImg("")
        } catch (error) {
          console.log(error.msg)
        }
      }
      uploadImg()
    }
  }, [img])

  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined On: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ) : null
}

export default Profile
