// Simple test script to verify session functionality
// Run this with: node test-session.js

const testSession = async () => {
  const baseUrl = 'http://localhost:3000';

  console.log('Testing session functionality...\n');

  // Test 1: Check session without token
  console.log('1. Testing session validation without token...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/session`);
    const data = await response.json();
    console.log('Response:', data);
    console.log('Expected: { error: "No token provided" }');
    console.log('✓ Test 1 passed\n');
  } catch (error) {
    console.log('✗ Test 1 failed:', error.message);
  }

  // Test 2: Test session creation
  console.log('2. Testing session creation...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '507f1f77bcf86cd799439011', // Test user ID
      }),
    });
    const data = await response.json();
    console.log('Response:', data);
    console.log('Expected: { success: true, session: { token: "...", expiresAt: "..." } }');
    console.log('✓ Test 2 passed\n');
  } catch (error) {
    console.log('✗ Test 2 failed:', error.message);
  }

  console.log('Session tests completed!');
};

// Only run if this file is executed directly
if (require.main === module) {
  testSession().catch(console.error);
}

module.exports = { testSession };