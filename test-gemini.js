// Test Gemini API functionality
async function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDJ7g9kLpZ2QhF3dRnW8vYXmT4A-GqN5eK';
    
    console.log('🧪 Testing Gemini API...');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "GM hesaplaması nedir? Maritime mühendisliğinde kısa açıklama yap."
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 500,
                }
            })
        });

        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return false;
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ Gemini API Response:');
            console.log(text);
            return true;
        } else {
            console.error('❌ Invalid response format:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
        return false;
    }
}

// Run test
testGeminiAPI().then(success => {
    if (success) {
        console.log('\n🎉 Gemini API çalışıyor!');
    } else {
        console.log('\n⚠️ Gerçek API anahtarı gerekiyor: https://aistudio.google.com/apikey');
    }
    process.exit(success ? 0 : 1);
});