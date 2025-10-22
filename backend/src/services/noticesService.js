const admin = require('firebase-admin');

const COLLECTION = 'notices';

function getDb() {
  if (!admin.apps.length) {
    // Mock Firestore using in-memory Map when Firebase not initialized
    if (!global._mockDb) global._mockDb = new Map();
    return {
      collection: (name) => ({
        add: async (data) => {
          const id = String(Math.random()).slice(2);
          const entry = { id, ...data };
          global._mockDb.set(id, entry);
          return { id };
        },
        doc: (id) => ({
          get: async () => ({ exists: global._mockDb.has(id), data: () => global._mockDb.get(id) }),
          set: async (d, opts) => { global._mockDb.set(id, { id, ...d }); return; },
          update: async (d) => { const existing = global._mockDb.get(id) || {}; global._mockDb.set(id, { ...existing, ...d }); return; },
          delete: async () => { global._mockDb.delete(id); return; }
        }),
        where: (field, op, value) => ({
          get: async () => {
            const docs = Array.from(global._mockDb.values()).filter(v => {
              if (op === '==') return v[field] === value;
              return true;
            }).map(v => ({ id: v.id, data: () => v }));
            return { docs };
          }
        }),
        get: async () => ({ docs: Array.from(global._mockDb.values()).map(v => ({ id: v.id, data: () => v })) })
      })
    };
  }
  return admin.firestore();
}

exports.listActiveNotices = async ({ department, year } = {}) => {
  const db = getDb();
  const now = Date.now();
  const col = db.collection(COLLECTION);
  let snapshot;
  if (department && year) {
    // attempt to apply where when using Firestore or our mock
    snapshot = await col.where('department', '==', department).get();
    // for simplicity when using Firestore, also filter year client-side
    const docs = snapshot.docs.map(d => d.data()).filter(n => n.year === year && new Date(n.expiry).getTime() > now);
    return docs;
  }
  snapshot = await col.get();
  const results = snapshot.docs.map(d => d.data()).filter(n => new Date(n.expiry).getTime() > now);
  return results;
};

exports.createNotice = async (notice) => {
  if (!notice || !notice.title || !notice.description || !notice.department || !notice.year || !notice.expiry) {
    const err = new Error('Invalid notice payload');
    err.status = 400;
    throw err;
  }

  const db = getDb();
  const col = db.collection(COLLECTION);
  const toSave = {
    title: notice.title,
    description: notice.description,
    department: notice.department,
    year: notice.year,
    expiry: new Date(notice.expiry).toISOString(),
    createdBy: notice.createdBy || 'unknown',
    createdAt: new Date().toISOString()
  };
  const ref = await col.add(toSave);
  return { id: ref.id, ...toSave };
};

exports.updateNotice = async (id, data) => {
  if (!id) throw new Error('id required');
  const db = getDb();
  const doc = db.collection(COLLECTION).doc(id);
  await doc.update(data);
  const res = await doc.get();
  return res.data();
};

exports.deleteNotice = async (id) => {
  if (!id) throw new Error('id required');
  const db = getDb();
  await db.collection(COLLECTION).doc(id).delete();
};
