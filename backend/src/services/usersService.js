const admin = require('firebase-admin');

function getDb() {
  if (!admin.apps.length) {
    if (!global._mockUsers) global._mockUsers = new Map();
    return {
      collection: () => ({
        doc: (id) => ({
          get: async () => ({ exists: global._mockUsers.has(id), data: () => global._mockUsers.get(id) }),
          set: async (d) => { global._mockUsers.set(id, d); },
          update: async (d) => { const ex = global._mockUsers.get(id) || {}; global._mockUsers.set(id, { ...ex, ...d }); }
        }),
        where: (field, op, value) => ({
          get: async () => {
            const docs = Array.from(global._mockUsers.values()).filter(u => u[field] === value).map(u => ({ id: u.uid, data: () => u }));
            return { docs };
          }
        }),
        add: async (d) => { const id = String(Math.random()).slice(2); global._mockUsers.set(id, d); return { id } }
      })
    }
  }
  return admin.firestore();
}

exports.getUserById = async (uid) => {
  const db = getDb();
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

exports.createUser = async ({ uid, email, name, role, department, year }) => {
  if (!uid) throw new Error('uid required');
  const db = getDb();
  const userDoc = {
    uid,
    email,
    name,
    role: role || 'student',
    department: department || null,
    year: year || null,
    approved: false,
    createdAt: new Date().toISOString()
  };
  await db.collection('users').doc(uid).set(userDoc);
}

exports.listPendingUsers = async () => {
  const db = getDb();
  // For Firestore, query where approved == false
  if (admin.apps.length) {
    const snap = await db.collection('users').where('approved', '==', false).get();
    return snap.docs.map(d => d.data());
  }
  // mock
  return Array.from(global._mockUsers.values()).filter(u => !u.approved);
}

exports.approveUser = async (uid) => {
  const db = getDb();
  await db.collection('users').doc(uid).update({ approved: true, approvedAt: new Date().toISOString() });
}
