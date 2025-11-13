/**
 * Rollback Script: Remove new voucher fields
 *
 * Purpose: Rollback migration if there are issues
 *
 * ⚠️  WARNING: This will remove maxUsage, currentUsage, maxDiscountAmount fields
 * Use only if you need to rollback to old code
 *
 * Usage:
 *   node migrations/rollback-vouchers-schema.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/topgear';

async function rollback() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const vouchersCollection = db.collection('vouchers');
    const usageCollection = db.collection('voucherusages');

    // 1. Confirm rollback
    console.log('⚠️  WARNING: This will rollback voucher schema changes');
    console.log('   - Remove maxUsage, currentUsage, maxDiscountAmount from vouchers');
    console.log('   - Drop VoucherUsage collection');
    console.log('\n⏸️  Waiting 5 seconds... Press Ctrl+C to cancel');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 2. Backup data first
    console.log('\n📦 Creating backup...');
    const vouchers = await vouchersCollection.find({}).toArray();
    const usages = await usageCollection.find({}).toArray();

    const fs = require('fs');
    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(
      `${backupDir}/vouchers-${timestamp}.json`,
      JSON.stringify(vouchers, null, 2)
    );
    fs.writeFileSync(
      `${backupDir}/voucher-usages-${timestamp}.json`,
      JSON.stringify(usages, null, 2)
    );

    console.log(`✅ Backup created at ${backupDir}/`);

    // 3. Remove new fields from vouchers
    console.log('\n🔄 Removing new fields from vouchers...');
    const result = await vouchersCollection.updateMany(
      {},
      {
        $unset: {
          maxUsage: '',
          currentUsage: '',
          maxDiscountAmount: ''
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} vouchers`);

    // 4. Drop VoucherUsage collection
    console.log('\n🗑️  Dropping VoucherUsage collection...');
    try {
      await usageCollection.drop();
      console.log('✅ VoucherUsage collection dropped');
    } catch (error) {
      if (error.message.includes('ns not found')) {
        console.log('ℹ️  VoucherUsage collection does not exist');
      } else {
        throw error;
      }
    }

    // 5. Verify rollback
    console.log('\n📊 Verification:');
    const withNewFields = await vouchersCollection.countDocuments({
      $or: [
        { maxUsage: { $exists: true } },
        { currentUsage: { $exists: true } },
        { maxDiscountAmount: { $exists: true } }
      ]
    });

    if (withNewFields === 0) {
      console.log('✅ Rollback successful! All new fields removed');
    } else {
      console.log(`⚠️  ${withNewFields} vouchers still have new fields`);
    }

    // 6. Sample check
    console.log('\n📝 Sample voucher after rollback:');
    const sample = await vouchersCollection.findOne({});
    console.log(JSON.stringify(sample, null, 2));

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run rollback
if (require.main === module) {
  rollback()
    .then(() => {
      console.log('\n🎉 Rollback completed successfully!');
      console.log('\n⚠️  Next steps:');
      console.log('   1. Deploy old code version');
      console.log('   2. Restart server');
      console.log('   3. Check backup files in ./backups/');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Rollback failed:', error);
      process.exit(1);
    });
}

module.exports = { rollback };
