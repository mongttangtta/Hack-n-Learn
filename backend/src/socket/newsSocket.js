import { WebSocketServer } from 'ws';
import { fetchBoanNewsList } from '../services/news.service.js';

export const initNewsSocket = (server) => {
        const wss = new WebSocketServer({ server, path: '/ws/news' });
        let latestTitles = [];

        wss.on('connection', (ws) => {
                console.log('Client connected to News WebSocket');

                ws.on('close', () => {
                        console.log('Client disconnected from News WebSocket');
                });
        });

        setInterval(async () => {
                try {
                        const list = await fetchBoanNewsList(1, 5);
                        if(!list.length) return;

                        const newArticles = list.filter((item) => !latestTitles.includes(item.title));
                        if (newArticles.length > 0) {
                                latestTitles = list.map(item => item.title);

                                wss.clients.forEach((client) => {
                                        if (client.readyState === 1) {
                                                client.send(JSON.stringify({ type: 'new_articles', articles: newArticles }));
                                        }
                                });
                        }
                } catch (error) {
                        console.error('Error fetching news for WebSocket:', error);
                }
        }, 180000); // 3분마다 체크
}