import express from 'express';

import { PORT, STATIC_DIRECTORY } from './constants.js';
import connectToDB from './models/index.js';
import apiRoutes from './routes/api.js';

const app = express();

app.use(express.static(STATIC_DIRECTORY));

app.use('/api', apiRoutes);

if (require.main === module) {
  app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Listening at http://localhost:${PORT}/`);
  });
}
