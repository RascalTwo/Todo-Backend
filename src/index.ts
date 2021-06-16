import express from 'express';
import expressWs from 'express-ws';

import { PORT, STATIC_DIRECTORY } from './constants.js';
import connectToDB from './models/index.js';

const app = express();
expressWs(app);

import apiRoutes from './routes/api.js';
import wsRoutes from './routes/ws.js';


app.use(express.static(STATIC_DIRECTORY));

app.use('/api', apiRoutes);
app.use('/ws', wsRoutes);

if (require.main === module) {
  app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Listening at http://localhost:${PORT}/`);
  });
}
