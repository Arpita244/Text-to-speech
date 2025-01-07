import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling

function TextToSpeechApp() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    fetchVoices();
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }, [selectedVoice]);

  const handleSpeak = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(voice => voice.name === selectedVoice);
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onend = () => {
      setHistory(prevHistory => [text, ...prevHistory]);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
    }
    setIsPaused(!isPaused);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`app-container ${theme}`} style={{ color: theme === 'light' ? '#000' : '#fff' }}>
      <header className="app-header">
        <h1>Text-to-Speech App</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </header>

      <main>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          rows="5"
          className="text-input"
        ></textarea>

        <div className="controls">
          <label>
            Voice:
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="voice-select"
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </label>

          <label>
            Pitch:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="slider"
            />
          </label>

          <label>
            Rate:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="slider"
            />
          </label>
        </div>

        <div className="buttons">
          <button onClick={handleSpeak} className="btn speak-btn">Speak</button>
          <button onClick={handleStop} className="btn stop-btn">Stop</button>
          <button onClick={handlePauseResume} className="btn pause-resume-btn">
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={clearHistory} className="btn clear-btn">Clear History</button>
        </div>

        <section className="history-section">
          <h2>Speech History</h2>
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={index} className="history-item">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>Developed with ❤️ using React</p>
      </footer>
    </div>
  );
}

export default TextToSpeechApp;
