import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 21001;

app.use(bodyParser.json());
const configFile = './config.json';

function loadConfig() {
    return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
}

app.use('/:gameName/*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const config = loadConfig();
    const appName = req.params.gameName;

    if (appName && config[appName]) {
        createProxyMiddleware({
            target: config[appName],
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                [`^/${appName}`]: ''
            }
        })(req, res, next);
    } else {
        res.status(404).send('Application not found');
    }
})

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
    console.log(`Proxy server running on http://localhost:${port}`);
});