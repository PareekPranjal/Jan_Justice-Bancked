import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✓ Connected: host=${conn.connection.host} db=${conn.connection.name}`);

    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found in this database yet.');
    } else {
      console.log(`Collections (${collections.length}):`);
      for (const c of collections) {
        const count = await conn.connection.db.collection(c.name).countDocuments();
        console.log(`  - ${c.name}: ${count} document(s)`);
      }
    }
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
