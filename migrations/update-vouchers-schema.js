/**
 * Migration Script: Update Vouchers Schema
 *
 * Purpose: Add new fields (maxUsage, currentUsage, maxDiscountAmount) to existing vouchers
 *
 * Run this BEFORE deploying the new code
 *
 * Usage:
 *   node migrations/update-vouchers-schema.js
 *
 * Or via MongoDB shell:
 *   mongo < migrations/update-vouchers-schema.js
 */

// MongoDB connection (adjust as needed)
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/topgear';

async function migrate() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const vouchersCollection = db.collection('vouchers');

    // 1. Check existing vouchers
    const existingCount = await vouchersCollection.countDocuments();
    console.log(`📊 Found ${existingCount} existing vouchers`);

    // 2. Check how many need migration
    const needMigration = await vouchersCollection.countDocuments({
      maxUsage: { $exists: false }
    });
    console.log(`🔄 ${needMigration} vouchers need migration`);

    if (needMigration === 0) {
      console.log('✅ All vouchers already migrated!');
      return;
    }

    // 3. Perform migration
    console.log('🚀 Starting migration...');

    const result = await vouchersCollection.updateMany(
      {
        maxUsage: { $exists: false }
      },
      {
        $set: {
          maxUsage: 9999,           // Default: 9999 uses (practically unlimited)
          currentUsage: 0,          // Start from 0
          maxDiscountAmount: 0      // 0 = unlimited discount
        }
      }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   - Matched: ${result.matchedCount}`);
    console.log(`   - Modified: ${result.modifiedCount}`);

    // 4. Verify migration
    const afterCount = await vouchersCollection.countDocuments({
      maxUsage: { $exists: true },
      currentUsage: { $exists: true },
      maxDiscountAmount: { $exists: true }
    });

    console.log(`\n📊 Verification:`);
    console.log(`   - Total vouchers: ${existingCount}`);
    console.log(`   - Migrated vouchers: ${afterCount}`);

    if (afterCount === existingCount) {
      console.log('✅ All vouchers successfully migrated!');
    } else {
      console.log('⚠️  Some vouchers may need manual review');
    }

    // 5. Sample check
    console.log('\n📝 Sample voucher after migration:');
    const sample = await vouchersCollection.findOne({});
    console.log(JSON.stringify(sample, null, 2));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run migration
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('\n🎉 Migration script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
