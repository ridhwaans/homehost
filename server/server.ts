import { createServer } from 'http';
import { Server } from 'socket.io';

// import { fileWatcher } from './jobs';
import { PORT } from './src/constants';
import { app } from './src/app';

// fileWatcher();
try {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} catch (error) {
  console.log(error);
}
