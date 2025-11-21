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
    const collName = 'productvariants';
    const collections = await db.listCollections({ name: collName }).toArray();
    if (collections.length === 0) {
      console.log(`Collection '${collName}' does not exist.`);
    } else {
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      console.log('productvariants count =', count);
      const sample = await coll.find({}, { projection: { variantName: 1, status: 1 } }).limit(10).toArray();
      console.log('sample documents:', JSON.stringify(sample, null, 2));
      const indexes = await coll.indexes();
      console.log('indexes:', JSON.stringify(indexes, null, 2));
    }
  } catch (err) {
    console.error('DB check error:', err);
  } finally {
    mongoose.disconnect();
  }
})();
