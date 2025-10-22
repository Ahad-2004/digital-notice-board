const admin = require('firebase-admin');
require('dotenv').config();
const { initAdminFromEnv } = require('../src/adminInit');

initAdminFromEnv();

async function seed() {
  if (!admin.apps.length) { console.error('Firebase Admin not initialized. Set env with service account.'); process.exit(1); }
  const db = admin.firestore();
  const users = [
    { uid: 'faculty1', email: 'prof1@example.com', name: 'Prof One', role: 'faculty', department: 'CSE' },
    { uid: 'student1', email: 'student1@example.com', name: 'Student One', role: 'student', department: 'CSE', year: '1st' }
  ];
  for (const u of users) {
    await db.collection('users').doc(u.uid).set(u);
    console.log('seeded user', u.uid);
  }
  const notices = [
    { title: 'Welcome', description: 'Welcome to the new semester', department: 'CSE', year: '1st', expiry: new Date(Date.now()+7*24*60*60*1000).toISOString(), createdBy: 'prof1@example.com', createdAt: new Date().toISOString() }
  ];
  for (const n of notices) {
    await db.collection('notices').add(n);
    console.log('seeded notice', n.title);
  }
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1) });
