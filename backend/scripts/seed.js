const { initAdminFromEnv } = require('../src/adminInit');
const admin = require('firebase-admin');

initAdminFromEnv();
if (!admin.apps.length) {
  console.error('Firebase Admin not initialized. Set env vars in .env with service account.');
  process.exit(1);
}

(async () => {
  const db = admin.firestore();
  const users = [
    { uid: 'faculty1', email: 'faculty1@school.edu', name: 'Prof One', role: 'faculty', department: 'CSE' },
    { uid: 'student1', email: 'student1@school.edu', name: 'Stud One', role: 'student', department: 'CSE', year: '1st' }
  ];
  for (const u of users) {
    await db.collection('users').doc(u.uid).set(u);
    console.log('seeded user', u.uid);
  }

  const notices = [
    { title: 'Welcome', description: 'Welcome to semester', department: 'CSE', year: '1st', expiry: new Date(Date.now()+7*24*3600*1000).toISOString(), createdBy: 'faculty1', createdAt: new Date().toISOString() }
  ];
  for (const n of notices) {
    const ref = await db.collection('notices').add(n);
    console.log('seeded notice', ref.id);
  }
  console.log('Done');
  process.exit(0);
})();
