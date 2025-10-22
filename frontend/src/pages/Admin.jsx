import React, { useEffect, useState } from 'react'

export default function Admin(){
  const [pending, setPending] = useState([])

  const load = async ()=>{
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/users', { headers: { Authorization: 'Bearer mock-faculty' }})
      const data = await res.json();
      setPending(data)
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ load() }, [])

  const approve = async (uid) => {
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/users/${uid}/approve`, { method: 'POST', headers: { Authorization: 'Bearer mock-faculty' }})
    load()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin</h1>
      <h2 className="text-xl mb-2">Pending Users</h2>
      <div className="space-y-2">
        {pending.map(u => (
          <div key={u.uid} className="p-3 border rounded bg-white">
            <div>{u.name} — {u.email} — {u.role}</div>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>approve(u.uid)}>Approve</button>
          </div>
        ))}
      </div>
    </div>
  )
}
