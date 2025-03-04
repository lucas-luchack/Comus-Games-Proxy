"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 21001;
app.use(body_parser_1.default.json());
const configFile = './config.json';
function loadConfig() {
    return JSON.parse(fs_1.default.readFileSync(configFile, 'utf-8'));
}
app.use('/:gameName', (req, res, next) => {
    const config = loadConfig();
    const appName = req.params.gameName;
    if (appName && config[appName]) {
        (0, http_proxy_middleware_1.createProxyMiddleware)({
            target: config[appName],
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                [`^/${appName}`]: ''
            }
        })(req, res, next);
    }
    else {
        res.status(404).send('Application not found');
    }
});
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
