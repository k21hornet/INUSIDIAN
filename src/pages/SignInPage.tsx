import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthTemplate from '../components/templates/AuthTemplate'
import AuthForm from '../components/organisms/AuthForm'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc } from 'firebase/firestore'

const SignInPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Firestore から username を取得
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const data = userDocSnap.data()

        // Context にセット
        setUser({
          id: firebaseUser.uid,
          email: data.email,
          username: data.username,
        })

        navigate("/")
      } else {
        console.error("ユーザードキュメントが存在しません")
      }
    } catch (error) {
      alert(error)
    }
  }

  return (
    <AuthTemplate title="Sign In">

      <AuthForm
        onSubmit={handleSignIn}
        submitText="Sign In"
        fields={[
          { label: 'Email',    type: 'email',    name: 'email',    value: email,    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
          { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
        ]}
      />

      <p className='mt-10 text-center text-sm/6'>
        <Link to={"/signup"} className="font-semibold text-indigo-600 hover:text-indigo-500">If you don't have any account, click here.</Link>
      </p>

    </AuthTemplate>
  )
}

export default SignInPage
