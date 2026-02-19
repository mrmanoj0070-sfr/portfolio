const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240;
// Maps the frame path to your folder
const currentFrame = index => (
  `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

const img = new Image()
img.src = currentFrame(1);
canvas.width = 1158;
canvas.height = 770;
img.onload = function() {
  context.drawImage(img, 0, 0);
}

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}

window.addEventListener('scroll', () => {  
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex + 1))
});

preloadImages();

/* Gemini API Chat Logic */
const SYSTEM_PROMPT = `You are an AI assistant representing Manojraj L. 
Answer only using the following info:
Name: Manojraj L. [cite: 1]
Education: BE-ECE at Govt College of Engineering Tirunelveli (2023-2027), 7.23 CGPA. [cite: 13]
Skills: Python, C++, Circuit Theory, Digital Electronics. [cite: 11, 14, 16, 17]
Contact: 78711 79650, mrmanoj0070@gmail.com. [cite: 4, 8]
Location: Thoothukudi. [cite: 2]
If the user asks something not in this text, politely say you only have information regarding Manojraj's professional profile.`;

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');
    const userText = input.value;

    if (!userText) return;

    chatBody.innerHTML += `<div><b>You:</b> ${userText}</div>`;
    input.value = '';

    // Replace with your actual API endpoint and key
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + userText }] }]
            })
        });
        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        chatBody.innerHTML += `<div><b>AI:</b> ${aiText}</div>`;
    } catch (error) {
        chatBody.innerHTML += `<div><b>Error:</b> Could not connect to AI.</div>`;
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}
