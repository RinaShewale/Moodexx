import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/hook/useauth";
import { useNavigate } from "react-router-dom";
import "./style/messages.scss";

const moodContent = {
  happy: [
    "Smile, it's a beautiful day! 😄",
    "Happiness is contagious, spread it around! 🌞",
    "Every day may not be good, but there's something good in every day. 😊",
    "Joy is not in things, it is in us. 💛",
    "Laugh often, live fully, love deeply. ❤️",
    "Be silly, be honest, be kind. 😁",
    "Happiness is homemade. 🏡",
    "Do more of what makes you happy! 🌈",
    "Positive vibes only! ✨",
    "Dance like nobody's watching. 💃",
    "Collect moments, not things. 🌸",
    "Life is better when you're smiling. 😃",
    "Your smile can change the world. 🌍",
    "Chase the sun and the happiness follows. ☀️",
    "Good things take time, be happy while waiting. ⏳",
    "Happiness is a choice, choose it today. 🌟",
    "Let your joy burst forth like fireworks! 🎆",
    "Laugh at yourself, it feels good! 😂",
    "Happiness looks good on you! 😎",
    "Find happiness in the little things. 🌷"
  ],
  sad: [
    "It's okay to feel sad sometimes. 🌧️",
    "Tears are words the heart can't express. 😢",
    "Even the darkest night will end. 🌙",
    "Sadness is part of life, embrace it. 💔",
    "This too shall pass. ⏳",
    "Let yourself grieve, it's healing. 🌿",
    "Storms make trees take deeper roots. 🌳",
    "Pain is temporary, strength is forever. 💪",
    "Some days are just clouds. ☁️",
    "Crying doesn't mean you're weak. 💧",
    "Healing begins when you allow yourself to feel. 🕊️",
    "Sadness is the pause before joy. 🎶",
    "It's okay not to be okay. 🌸",
    "Your feelings are valid. ❤️",
    "Even flowers grow through dirt. 🌼",
    "The night is darkest just before the dawn. 🌅",
    "Pain is real, but so is hope. ✨",
    "Let the tears water your soul. 🌧️",
    "Sometimes silence is needed to heal. 🤍",
    "Be gentle with yourself today. 🌷"
  ],
  neutral: [
    "Take a deep breath, everything's fine. 🌬️",
    "Balance is key. ⚖️",
    "Today is another page in your story. 📖",
    "Stay calm and carry on. 🕊️",
    "Observe, don’t react. 👀",
    "Sometimes nothing needs to be done. 🌿",
    "Keep moving forward steadily. 🏞️",
    "Patience is a form of wisdom. 🕰️",
    "Neutrality brings clarity. 💭",
    "Take things one step at a time. 👣",
    "Embrace the stillness. 🌾",
    "Life flows in moments of calm. 🌊",
    "Focus on the present moment. ⏳",
    "Stay grounded, stay centered. 🌳",
    "A balanced mind is a peaceful mind. 🌟",
    "Notice the small things around you. 🍂",
    "In simplicity there is clarity. ✨",
    "Let go of what you can’t control. 🌬️",
    "Observe life with a clear mind. 👓",
    "Stay open, stay neutral. 🌼"
  ],
  surprised: [
    "Wow! Didn’t see that coming! 😲",
    "Life is full of surprises, embrace them. 🎉",
    "Expect the unexpected. 🌟",
    "Every twist is an adventure. 🌀",
    "Surprises make life exciting! ✨",
    "Keep your eyes wide open, magic happens! 👀",
    "Life’s surprises are gifts in disguise. 🎁",
    "The unexpected can be wonderful. 🌈",
    "Curiosity leads to discovery. 🔍",
    "Be ready for surprises around the corner. 🏞️",
    "Astonishment fuels creativity. 💡",
    "Let the world surprise you daily. 🌍",
    "Sometimes the shock is a blessing. 🙌",
    "Adventure begins where plans end. 🗺️",
    "Expect miracles in ordinary days. ✨",
    "The unexpected can spark joy. 🎇",
    "Surprise yourself by trying new things. 🎨",
    "Every day brings something new. ☀️",
    "Stay amazed by life’s wonders. 🌸",
    "Keep your heart open to surprises. 💖"
  ],
  angry: [
    "Take a deep breath, it's going to be okay. 😡",
    "Let the anger pass like clouds in the sky. ☁️",
    "Channel your anger into something productive! 💪",
    "Even storms end, stay strong. 🌩️",
    "Anger is temporary, peace is permanent. 🕊️",
    "Pause, reflect, then act wisely. 🧘‍♂️",
    "Don't let anger control you, control your anger. 🔥",
    "Use your frustration to fuel positive change. ⚡",
    "Anger is a signal, not a solution. 🚦",
    "Remember to breathe, it's just a moment. 🌬️",
    "Release the tension, embrace calm. 🌿",
    "Anger shows you care, now channel it smartly. 🎯",
    "Step back, observe, then respond. 👀",
    "Let your heart cool down before speaking. ❄️",
    "Even volcanoes calm down eventually. 🌋",
    "Your power lies in control, not rage. 🏔️",
    "Anger is a visitor, welcome it and let it go. 🚪",
    "Transform anger into motivation. 🏃‍♂️",
    "Pause, breathe, smile… and move forward. 😊",
    "Even in anger, choose kindness. ❤️"
  ]
};

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mood, setMood] = useState("happy");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Get latest mood
    const latestMood = localStorage.getItem("latestMood") || "happy";
    setMood(latestMood);

    // Get quotes for mood, fallback to happy if mood missing
    const quotes = moodContent[latestMood] || moodContent["happy"];
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    } else {
      setQuote("Keep smiling! 😄");
    }
  }, []);

  // Reset notifications when user opens messages
  useEffect(() => {
    if (user?.username) {
      const key = `${user.username}_notifications`;
      localStorage.setItem(key, "0");
    }
  }, [user]);

  return (
    <div className="recommendation-page">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      <div className="user-greeting">
        <h2>Hello, {user ? user.username : "Guest"}!</h2>
        <p>Your mood today: <strong>{mood.toUpperCase()}</strong></p>
      </div>

      <div className="quote-box">
        <p>"{quote}"</p>
      </div>
    </div>
  );
}