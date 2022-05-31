import React, { useEffect, useState } from "react"
import { db, auth, storage } from "../firebase"
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore"
import User from "../components/User"
import MessageForm from "../components/MessageForm"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const Home = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState("")
  const [text, setText] = useState("")
  const [img, setImg] = useState("")

  const user1 = auth.currentUser.uid //currently logged in user

  useEffect(() => {
    const usersRef = collection(db, "users")
    // create query object
    const q = query(usersRef, where("uid", "not-in", [user1]))
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = []
      querySnapshot.forEach((doc) => users.push(doc.data()))
      setUsers(users)
    })
    return () => unsub()
  }, [])

  const selectUser = (user) => {
    setChat(user)
    console.log(user)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user2 = chat.uid
    // messages => id => chat => add doc
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    let url
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      )
      const snap = await uploadBytes(imgRef, img)
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = dlUrl
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text: text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    })
    setText("")
  }

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start conversation</h3>
        )}
      </div>
    </div>
  )
}

export default Home
