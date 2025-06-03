import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthTemplate from '../components/templates/AuthTemplate'
import AuthForm from '../components/organisms/AuthForm'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

   try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date()
      })

      // Context にセット
      if(user.uid && user.email) {
        setUser({
          id: user.uid,
          email: user.email,
          username: username,
        })
      } else {
        console.log("error")        
      }

      navigate("/");
    } catch (error) {
      alert(error);
    }
  }
  
  return (
    <AuthTemplate title="Sign Up">

      <AuthForm
        onSubmit={handleSignup}
        submitText="Sign Up"
        fields={[
          { label: 'User Name',        type: 'text',     name: 'username',        value: username,        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value) },
          { label: 'Email',            type: 'email',    name: 'email',           value: email,           onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
          { label: 'Password',         type: 'password', name: 'password',        value: password,        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
          { label: 'Password Confirm', type: 'password', name: 'passwordConfirm', value: passwordConfirm, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value) },
        ]}
      />

      <p className='mt-10 text-center text-sm/6'>
        <Link to={"/signin"} className="font-semibold text-indigo-600 hover:text-indigo-500">If you have an account, click here.</Link>
      </p>

    </AuthTemplate>
  )
}

export default SignUpPage
