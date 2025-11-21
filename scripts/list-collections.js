require('dotenv').config();
const mongoose = require('mongoose');

function buildUri() {
  const raw = process.env.MONGO_URI;
  if (raw) {
    const hasCreds = /:\/\/[^/]+:[^@]+@/.test(raw);
    if (hasCreds || !(process.env.DB_USER || process.env.DB_PASSWORD)) {
      return raw;
    }
  }
  const user = process.env.DB_USER || '';
  const pass = process.env.DB_PASSWORD ? encodeURIComponent(process.env.DB_PASSWORD) : '';
  const host = process.env.DB_HOST || 'cluster-ecom-cho-be-tai.nwdiimc.mongodb.net';
  const db = process.env.DB_NAME || 'ecomerce-top-gear';
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
}

(async () => {
  const uri = buildUri();
  console.log('Using Mongo URI (masked):', uri.replace(/:\/\/.*@/, '://***@'));
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    for (const c of collections) {
      const coll = db.collection(c.name);
      const count = await coll.countDocuments();
      console.log(`${c.name}: ${count}`);
    }
  } catch (err) {
    console.error('Error listing collections:', err);
  } finally {
    mongoose.disconnect();
  }
})();
