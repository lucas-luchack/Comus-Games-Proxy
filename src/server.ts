import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 21001;

const configFile = './config.json';

function loadConfig() {
    return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
}

app.use('/:gameName', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const config = loadConfig();
    const appName = req.params.gameName;

    if (appName && config[appName]) {
        createProxyMiddleware({
            target: config[appName],
            changeOrigin: true,
            ws: true,
            secure: false,
            headers: {
                'X-Forwarded-Proto': 'https',
                'Connection': 'keep-alive'
            },
        })(req, res, next);
    } else {
        res.status(404).send('Application not found');
    }
})

app.use(bodyParser.json());

/**
app.use((req, res, next) => {
    const config = loadConfig();
    const appName =
    const appName = req.headers['x-comus-requested-game'] as string;

    if (appName && config[appName]) {
        createProxyMiddleware({
            target: config[appName],
            changeOrigin: true,
            ws: true,
        })(req, res, next);
    } else {
        res.status(404).send('Application not found');
    }
});
*/

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});