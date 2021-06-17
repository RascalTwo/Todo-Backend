import path from 'path';
import fs from 'fs';

import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import { CORS_ORIGIN, PORT, STATIC_DIRECTORY } from './constants.js';
import connectToDB from './models/index.js';

const app = express();
app.use(cors({
  origin: CORS_ORIGIN
}));
expressWs(app);

import apiRoutes from './routes/api.js';
import wsRoutes from './routes/ws.js';

app.use('/api', apiRoutes);
app.use('/ws', wsRoutes);

(async () => {
  if (!STATIC_DIRECTORY) {
    console.warn('Static directory not defined; not serving static any assets');
    return;
  }

  if (!fs.existsSync(STATIC_DIRECTORY)){
    console.warn('Static directory defined does not exist; not serving static any assets');
    return;
  }

  app.use(express.static(STATIC_DIRECTORY));

  const indexFilepath = path.join(STATIC_DIRECTORY, 'index.html');
  if (!fs.existsSync(indexFilepath)) {
    console.warn('Static directory does not contain index.html; not enabling HTTP History Path fallback');
    return
  }

  app.get('*', (_, res) => res.sendFile(indexFilepath));
})();

if (require.main === module) {
  app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Listening at http://localhost:${PORT}/`);
  });
}
