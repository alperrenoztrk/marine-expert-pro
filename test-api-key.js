// Test Gemini API Key
const API_KEY = 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Key...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Test message - respond with 'Hello'"
          }]
        }]
      })
    });

    console.log(`📡 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key ÇALIŞIYOR!');
      console.log('🎯 Response:', data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text response');
      return true;
    } else {
      const error = await response.text();
      console.log('❌ API Key HATALI:', error);
      return false;
    }
  } catch (error) {
    console.log('🚫 Network Error:', error.message);
    return false;
  }
}

testGeminiAPI().then(success => {
  console.log(success ? '\n🎉 API anahtarı geçerli!' : '\n⚠️ API anahtarı sorunlu!');
});