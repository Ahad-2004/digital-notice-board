import React, { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { createUserProfile } from '../services/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleLogin = async () => {
    try{
      await signInWithEmailAndPassword(auth, email, password)
      alert('Logged in')
    }catch(e){
      alert(e.message)
    }
  }

  const handleRegister = async () => {
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // create user profile in backend
      await createUserProfile({ name, role: 'student', department: 'CSE', year: '1st' })
      alert('Registered')
    }catch(e){
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        {isRegister && <input className="w-full border p-2 mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />}
        <input className="w-full border p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <div className="flex gap-2">
          {isRegister ? (
            <button className="w-full bg-green-600 text-white p-2 rounded" onClick={handleRegister}>Register</button>
          ) : (
            <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={handleLogin}>Sign in</button>
          )}
          <button className="w-full border p-2 rounded" onClick={()=>setIsRegister(s=>!s)}>{isRegister ? 'Have account? Login' : 'New? Register'}</button>
        </div>
      </div>
    </div>
  )
}
