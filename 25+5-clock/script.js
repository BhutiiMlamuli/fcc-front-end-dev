const { useState, useEffect, useRef, useCallback } = React;

const Clock = () => {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const [isReset, setIsReset] = useState(false);
    
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    
    // Format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Handle timer countdown
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            // Play beep sound
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            }
            
            // Switch between session and break
            if (isSession) {
                setIsSession(false);
                setTimeLeft(breakLength * 60);
            } else {
                setIsSession(true);
                setTimeLeft(sessionLength * 60);
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, isSession, breakLength, sessionLength]);
    
    // Update timeLeft when session length changes (only when timer is not running)
    useEffect(() => {
        if (!isRunning && isSession) {
            setTimeLeft(sessionLength * 60);
        }
    }, [sessionLength, isSession, isRunning]);
    
    // Handle start/stop
    const handleStartStop = () => {
        setIsRunning(prev => !prev);
    };
    
    // Handle reset
    const handleReset = () => {
        // Stop timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Stop and rewind audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        // Reset all values
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setIsRunning(false);
        setIsSession(true);
        setIsReset(true);
        
        // Reset the reset flag after a short delay
        setTimeout(() => setIsReset(false), 100);
    };
    
    // Handle break decrement
    const handleBreakDecrement = () => {
        if (!isRunning && breakLength > 1) {
            setBreakLength(prev => prev - 1);
        }
    };
    
    // Handle break increment
    const handleBreakIncrement = () => {
        if (!isRunning && breakLength < 60) {
            setBreakLength(prev => prev + 1);
        }
    };
    
    // Handle session decrement
    const handleSessionDecrement = () => {
        if (!isRunning && sessionLength > 1) {
            setSessionLength(prev => prev - 1);
        }
    };
    
    // Handle session increment
    const handleSessionIncrement = () => {
        if (!isRunning && sessionLength < 60) {
            setSessionLength(prev => prev + 1);
        }
    };
    
    // Handle keyboard shortcuts
    const handleKeyDown = useCallback((event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            handleStartStop();
        } else if (event.code === 'KeyR') {
            event.preventDefault();
            handleReset();
        }
    }, [isRunning]);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    
    return (
        <div className={`clock-container ${!isSession ? 'break-active' : ''}`}>
            <h1 className="title">
                {isSession ? '🍅 Pomodoro Clock' : '☕ Break Time'}
            </h1>
            
            <div className="length-controls">
                <div className="length-control">
                    <div id="break-label" className="label">Break Length</div>
                    <div className="controls">
                        <button 
                            id="break-decrement" 
                            onClick={handleBreakDecrement}
                            disabled={isRunning}
                        >
                            ⬇
                        </button>
                        <div id="break-length" className="length-value">
                            {breakLength}
                        </div>
                        <button 
                            id="break-increment" 
                            onClick={handleBreakIncrement}
                            disabled={isRunning}
                        >
                            ⬆
                        </button>
                    </div>
                </div>
                
                <div className="length-control">
                    <div id="session-label" className="label">Session Length</div>
                    <div className="controls">
                        <button 
                            id="session-decrement" 
                            onClick={handleSessionDecrement}
                            disabled={isRunning}
                        >
                            ⬇
                        </button>
                        <div id="session-length" className="length-value">
                            {sessionLength}
                        </div>
                        <button 
                            id="session-increment" 
                            onClick={handleSessionIncrement}
                            disabled={isRunning}
                        >
                            ⬆
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="timer-display">
                <div id="timer-label">
                    {isSession ? 'Session' : 'Break'}
                </div>
                <div id="time-left">
                    {formatTime(timeLeft)}
                </div>
            </div>
            
            <div className="timer-controls">
                <button id="start_stop" onClick={handleStartStop}>
                    {isRunning ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button id="reset" onClick={handleReset}>
                    🔄 Reset
                </button>
            </div>
            
            <audio 
                id="beep" 
                ref={audioRef}
                src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                preload="auto"
            />
        </div>
    );
};

ReactDOM.render(<Clock />, document.getElementById('root'));