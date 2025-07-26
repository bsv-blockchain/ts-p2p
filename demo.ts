import { TeranodeListener } from './src/index';

// Demo of the new TeranodeListener API
const blockCallback = (data: Uint8Array, topic: string, from: string) => {
  console.log(`📦 New block received from ${from}:`);
  console.log(`   Topic: ${topic}`);
  console.log(`   Data size: ${data.length} bytes`);
  console.log(`   Data preview: ${Array.from(data.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')}...`);
};

const subtreeCallback = (data: Uint8Array, topic: string, from: string) => {
  console.log(`🌳 Subtree update from ${from}:`);
  console.log(`   Topic: ${topic}`);
  console.log(`   Data size: ${data.length} bytes`);
};

// Create listener with topic callbacks
console.log('🚀 Starting TeranodeListener demo...');

const listener = new TeranodeListener({
  'bitcoin/mainnet-block': blockCallback,
  'bitcoin/mainnet-subtree': subtreeCallback
});

console.log('✅ TeranodeListener created and starting...');
console.log('📡 Connecting to Teranode mainnet...');
console.log('⏳ Waiting for messages...');

// Add a dynamic topic after 10 seconds
setTimeout(() => {
  console.log('➕ Adding mempool topic dynamically...');
  listener.addTopicCallback('bitcoin/mainnet-mempool', (data, topic, from) => {
    console.log(`💾 Mempool update from ${from}: ${data.length} bytes`);
  });
}, 10000);

// Log peer count every 30 seconds
setInterval(() => {
  const peerCount = listener.getConnectedPeerCount();
  console.log(`👥 Connected peers: ${peerCount}`);
}, 30000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down TeranodeListener...');
  await listener.stop();
  console.log('✅ TeranodeListener stopped');
  process.exit(0);
});
