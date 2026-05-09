const { useState, useEffect } = React;

// Configure marked options
marked.setOptions({
    breaks: true, // Add line breaks on single newlines
    gfm: true, // GitHub Flavored Markdown
    sanitize: false, // Allow HTML in markdown
    highlight: function(code) {
        return code;
    }
});

const defaultMarkdown = `# Welcome to Markdown Previewer!

## This is a sub-heading

Here's a [link to freeCodeCamp](https://www.freecodecamp.org)

Inline code: \`<div></div>\`

\`\`\`javascript
// This is a code block
function hello() {
    console.log("Hello, World!");
}
\`\`\`

- This is a list item
- Another list item
  - Nested list item
  - Another nested item

> This is a blockquote
> It can span multiple lines

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)

**This is bolded text**

1. Numbered list item
2. Another numbered item
3. Third item

Here's a table:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

*This is italicized text*`;

function MarkdownPreviewer() {
    const [markdown, setMarkdown] = useState(defaultMarkdown);
    const [html, setHtml] = useState('');
    
    useEffect(() => {
        // Parse markdown to HTML whenever markdown changes
        const parsedHtml = marked(markdown);
        setHtml(parsedHtml);
    }, [markdown]);
    
    const handleEditorChange = (e) => {
        setMarkdown(e.target.value);
    };
    
    return (
        <div>
            <h1 className="app-title">📝 Markdown Previewer</h1>
            <div className="app-container">
                <div className="editor-container">
                    <div className="toolbar">
                        <span className="toolbar-icon">✏️</span>
                        Editor
                    </div>
                    <textarea
                        id="editor"
                        value={markdown}
                        onChange={handleEditorChange}
                        placeholder="Enter your markdown here..."
                    />
                </div>
                <div className="preview-container">
                    <div className="toolbar">
                        <span className="toolbar-icon">👁️</span>
                        Previewer
                    </div>
                    <div
                        id="preview"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<MarkdownPreviewer />, document.getElementById('root'));