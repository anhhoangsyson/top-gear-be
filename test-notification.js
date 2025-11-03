/**
 * Script để test notification system
 * 
 * Cách chạy:
 * 1. Đảm bảo server đang chạy
 * 2. Thay YOUR_JWT_TOKEN và YOUR_USER_ID
 * 3. node test-notification.js
 */

const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const JWT_TOKEN = 'YOUR_JWT_TOKEN'; // Thay bằng token thật
const USER_ID = 'YOUR_USER_ID'; // Thay bằng user ID thật

// Test REST API
async function testRestAPI() {
  console.log('\n🧪 Testing REST API...\n');

  try {
    // 1. Get notifications
    console.log('1️⃣ Getting notifications...');
    const notificationsRes = await axios.get(
      `${BASE_URL}/api/v1/notifications?page=1&limit=10`,
      {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      }
    );
    console.log('✅ Notifications:', notificationsRes.data);

    // 2. Get unread count
    console.log('\n2️⃣ Getting unread count...');
    const unreadRes = await axios.get(
      `${BASE_URL}/api/v1/notifications/unread-count`,
      {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      }
    );
    console.log('✅ Unread count:', unreadRes.data);

    // 3. Create test notification
    console.log('\n3️⃣ Creating test notification...');
    const createRes = await axios.post(
      `${BASE_URL}/api/v1/notifications`,
      {
        userId: USER_ID,
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test notification from test script',
        data: { test: true, timestamp: new Date().toISOString() },
        link: '/test'
      },
      {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      }
    );
    console.log('✅ Created notification:', createRes.data);

    const notificationId = createRes.data.data._id;

    // 4. Mark as read
    console.log('\n4️⃣ Marking notification as read...');
    const readRes = await axios.patch(
      `${BASE_URL}/api/v1/notifications/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      }
    );
    console.log('✅ Marked as read:', readRes.data);

    // 5. Delete notification
    console.log('\n5️⃣ Deleting notification...');
    const deleteRes = await axios.delete(
      `${BASE_URL}/api/v1/notifications/${notificationId}`,
      {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      }
    );
    console.log('✅ Deleted notification:', deleteRes.data);

    console.log('\n✅ REST API tests completed!\n');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test Socket.io
function testSocketIO() {
  console.log('\n🧪 Testing Socket.IO...\n');

  const socket = io(BASE_URL, {
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO');
    console.log('Socket ID:', socket.id);

    // Authenticate
    console.log('\n🔐 Authenticating...');
    socket.emit('authenticate', JWT_TOKEN);
  });

  socket.on('authenticated', (data) => {
    console.log('✅ Authenticated:', data);
  });

  socket.on('authentication_error', (error) => {
    console.error('❌ Authentication error:', error);
  });

  socket.on('new_notification', (data) => {
    console.log('\n🔔 NEW NOTIFICATION RECEIVED:');
    console.log(JSON.stringify(data, null, 2));
  });

  socket.on('notification_read', (data) => {
    console.log('\n👁️ NOTIFICATION READ:');
    console.log(JSON.stringify(data, null, 2));
  });

  socket.on('all_notifications_read', (data) => {
    console.log('\n✅ ALL NOTIFICATIONS READ:');
    console.log(JSON.stringify(data, null, 2));
  });

  socket.on('notification_deleted', (data) => {
    console.log('\n🗑️ NOTIFICATION DELETED:');
    console.log(JSON.stringify(data, null, 2));
  });

  socket.on('disconnect', () => {
    console.log('\n❌ Disconnected from Socket.IO');
  });

  socket.on('error', (error) => {
    console.error('\n❌ Socket error:', error);
  });

  // Keep connection alive with ping
  setInterval(() => {
    socket.emit('ping');
  }, 30000);

  console.log('⏳ Listening for realtime events... (Press Ctrl+C to exit)\n');
}

// Main
async function main() {
  if (JWT_TOKEN === 'YOUR_JWT_TOKEN' || USER_ID === 'YOUR_USER_ID') {
    console.error('\n❌ Please update JWT_TOKEN and USER_ID in the script first!\n');
    console.log('How to get token:');
    console.log('1. Login via POST /api/v1/auth/login');
    console.log('2. Copy the token from response');
    console.log('3. Update JWT_TOKEN and USER_ID in this script\n');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const mode = args[0] || 'all';

  console.log('╔════════════════════════════════════════╗');
  console.log('║   Notification System Test Script     ║');
  console.log('╚════════════════════════════════════════╝');

  if (mode === 'api' || mode === 'all') {
    await testRestAPI();
  }

  if (mode === 'socket' || mode === 'all') {
    testSocketIO();
  }
}

// Run
main();

// Usage examples:
// node test-notification.js           - Test both API and Socket.IO
// node test-notification.js api       - Test REST API only
// node test-notification.js socket    - Test Socket.IO only

