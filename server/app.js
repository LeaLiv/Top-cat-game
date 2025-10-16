import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { routesInit } from './routes/config_routes.js';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());


routesInit(app);
const server = http.createServer(app);

const port = process.env.PORT || "3001"
server.listen(port, () => console.log(`Listening on port ${port}`));