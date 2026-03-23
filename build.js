const fetch = require('node-fetch');
const fs = require('fs');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL = '@nomuradi';

async function getLatestPosts() {
    try {
        // Get channel info and recent messages using getUpdates workaround
        // We'll scrape the public channel page instead
        const response = await fetch('https://t.me/s/nomuradi');
        const html = await response.text();
        
        // Extract post IDs from the page
        const postMatches = html.match(/data-post="nomuradi\/(\d+)"/g) || [];
        const postIds = postMatches
            .map(m => m.match(/(\d+)/)[1])
            .map(Number)
            .sort((a, b) => b - a)
            .slice(0, 6);
        
        console.log('Found posts:', postIds);
        return postIds.length > 0 ? postIds : [1461, 1460, 1459];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [1461, 1460, 1459];
    }
}

async function build() {
    const postIds = await getLatestPosts();
    
    // Read template
    let html = fs.readFileSync('template.html', 'utf8');
    
    // Generate widget code for latest posts
    const widgetCode = postIds.slice(0, 4).map(id => 
        `<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-post="nomuradi/${id}" data-width="100%" data-dark="1"></script>`
    ).join('\n                ');
    
    // Replace placeholder
    html = html.replace('{{TELEGRAM_WIDGETS}}', widgetCode);
    
    // Write output
    fs.mkdirSync('public', { recursive: true });
    fs.writeFileSync('public/index.html', html);
    
    console.log('Build complete with posts:', postIds.slice(0, 4));
}

build();
