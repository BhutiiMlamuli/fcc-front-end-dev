const { useState, useEffect } = React;

function QuoteMachine() {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Array of quotes with authors
    const quotes = [
        {
            text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            author: "Nelson Mandela"
        },
        {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney"
        },
        {
            text: "Life is what happens when you're busy making other plans.",
            author: "John Lennon"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
            author: "Mother Teresa"
        },
        {
            text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
            author: "Robert Louis Stevenson"
        },
        {
            text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
            author: "Helen Keller"
        },
        {
            text: "It is during our darkest moments that we must focus to see the light.",
            author: "Aristotle"
        },
        {
            text: "Whoever is happy will make others happy too.",
            author: "Anne Frank"
        },
        {
            text: "Try to be a rainbow in someone's cloud.",
            author: "Maya Angelou"
        },
        {
            text: "You miss 100% of the shots you don't take.",
            author: "Wayne Gretzky"
        },
        {
            text: "Whether you think you can or you think you can't, you're right.",
            author: "Henry Ford"
        },
        {
            text: "The only impossible journey is the one you never begin.",
            author: "Tony Robbins"
        },
        {
            text: "In the middle of difficulty lies opportunity.",
            author: "Albert Einstein"
        },
        {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill"
        }
    ];
    
    const getRandomQuote = () => {
        setLoading(true);
        
        // Simulate a small delay for smooth transition
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];
            setQuote(randomQuote.text);
            setAuthor(randomQuote.author);
            setLoading(false);
            
            // Change background color randomly
            changeBackgroundColor();
        }, 300);
    };
    
    const changeBackgroundColor = () => {
        const colors = [
            '#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c',
            '#9b59b6', '#FB6964', '#342224', '#472E32', '#BDBB99',
            '#77B1A9', '#73A857', '#667eea', '#764ba2', '#6B5B95'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.background = `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`;
        document.getElementById('new-quote').style.background = `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`;
    };
    
    useEffect(() => {
        getRandomQuote();
    }, []);
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote}" - ${author}`)}`;
    
    return (
        <div id="quote-box">
            <div className="quote-icon">
                <span role="img" aria-label="quote">💭</span>
            </div>
            <div id="text" className={loading ? 'loading' : ''}>
                <span role="img" aria-label="quote mark" style={{ marginRight: '10px', fontSize: '2rem', color: '#667eea' }}>❝</span>
                {quote || 'Loading...'}
            </div>
            <div id="author" className={loading ? 'loading' : ''}>
                - {author || 'Unknown'}
            </div>
            <div className="buttons">
                <a
                    id="tweet-quote"
                    href={tweetUrl}
                    target="_top"
                >
                    <span role="img" aria-label="twitter">🐦</span> Tweet
                </a>
                <button id="new-quote" onClick={getRandomQuote} disabled={loading}>
                    {loading ? 'Loading...' : 'New Quote'}
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<QuoteMachine />, document.getElementById('root'));