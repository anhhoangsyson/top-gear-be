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
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const sample = await db.collection('products').find({}).limit(5).toArray();
    console.log('products sample:', JSON.stringify(sample, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
})();
