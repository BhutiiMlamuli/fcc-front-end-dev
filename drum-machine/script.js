const { useState, useEffect, useCallback } = React;

const drumPadsData = [
    {
        id: 'Heater-1',
        key: 'Q',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
        description: 'Heater 1'
    },
    {
        id: 'Heater-2',
        key: 'W',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
        description: 'Heater 2'
    },
    {
        id: 'Heater-3',
        key: 'E',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
        description: 'Heater 3'
    },
    {
        id: 'Heater-4',
        key: 'A',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
        description: 'Heater 4'
    },
    {
        id: 'Clap',
        key: 'S',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
        description: 'Clap'
    },
    {
        id: 'Open-HH',
        key: 'D',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
        description: 'Open HH'
    },
    {
        id: "Kick-n'-Hat",
        key: 'Z',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
        description: 'Kick n Hat'
    },
    {
        id: 'Kick',
        key: 'X',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
        description: 'Kick'
    },
    {
        id: 'Closed-HH',
        key: 'C',
        src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
        description: 'Closed HH'
    }
];

function DrumMachine() {
    const [display, setDisplay] = useState('');
    const [volume, setVolume] = useState(0.5);
    const [activePad, setActivePad] = useState(null);
    
    const playSound = useCallback((padData) => {
        const audio = document.getElementById(padData.key);
        if (audio) {
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            setDisplay(padData.description);
            setActivePad(padData.key);
            setTimeout(() => setActivePad(null), 100);
        }
    }, [volume]);
    
    const handleKeyPress = useCallback((event) => {
        const key = event.key.toUpperCase();
        const padData = drumPadsData.find(pad => pad.key === key);
        if (padData) {
            playSound(padData);
        }
    }, [playSound]);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
    
    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        setDisplay(`Volume: ${Math.round(newVolume * 100)}%`);
    };
    
    return (
        <div id="drum-machine">
            <div className="title">🥁 Drum Machine</div>
            
            <div id="display">
                {display || 'Ready to Play!'}
            </div>
            
            <div className="drum-pads">
                {drumPadsData.map(pad => (
                    <div
                        key={pad.id}
                        id={pad.id}
                        className={`drum-pad ${activePad === pad.key ? 'active' : ''}`}
                        onClick={() => playSound(pad)}
                    >
                        {pad.key}
                        <audio
                            className="clip"
                            id={pad.key}
                            src={pad.src}
                        ></audio>
                    </div>
                ))}
            </div>
            
            <div className="volume-slider">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
            
            <div className="controls">
                <button 
                    className="control-button"
                    onClick={() => setDisplay('')}
                >
                    Clear Display
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<DrumMachine />, document.getElementById('root'));