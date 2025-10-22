import React, { useEffect, useState } from 'react'
import { fetchNotices, createNotice, deleteNotice } from '../services/api'

export default function Dashboard(){
  const [notices, setNotices] = useState([])
  const [form, setForm] = useState({ title:'', description:'', department:'CSE', year:'1st', expiry: new Date(Date.now()+86400000).toISOString().slice(0,16) })

  const load = async ()=>{
    const data = await fetchNotices()
    const now = Date.now();
    const filtered = data.filter(n => new Date(n.expiry).getTime() > now)
    setNotices(filtered)
  }

  useEffect(()=>{ load() }, [])

  const handleCreate = async () => {
    const toSend = { ...form, expiry: new Date(form.expiry).toISOString() }
    await createNotice(toSend, 'faculty')
    setForm({ title:'', description:'', department:'CSE', year:'1st', expiry: new Date(Date.now()+86400000).toISOString().slice(0,16) })
    load()
  }

  const handleDelete = async (id) => {
    await deleteNotice(id, 'faculty')
    load()
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Notices</h1>

      <div className="mb-6 p-4 border rounded bg-white">
        <h2 className="text-xl mb-2">Create Notice (faculty)</h2>
        <input className="w-full border p-2 mb-2" placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} />
        <textarea className="w-full border p-2 mb-2" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        <div className="flex gap-2 mb-2">
          <select className="border p-2" value={form.department} onChange={e=>setForm(f=>({...f, department:e.target.value}))}>
            <option>CSE</option>
            <option>IT</option>
            <option>ECE</option>
          </select>
          <select className="border p-2" value={form.year} onChange={e=>setForm(f=>({...f, year:e.target.value}))}>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
          <input type="datetime-local" className="border p-2" value={form.expiry} onChange={e=>setForm(f=>({...f, expiry:e.target.value}))} />
        </div>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
      </div>

      <div className="grid gap-4">
        {notices.map(n=> (
          <div key={n.id} className="p-4 border rounded bg-white">
            <h3 className="text-xl">{n.title}</h3>
            <p>{n.description}</p>
            <div className="text-sm text-gray-500">Expiry: {new Date(n.expiry).toLocaleString()}</div>
            <div className="mt-2">
              <button onClick={()=>handleDelete(n.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
