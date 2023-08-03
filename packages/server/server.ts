import figlet from 'figlet';

// import { fileWatcher } from './jobs';
import { PORT } from './src/constants';
import { app } from './src/app';

// fileWatcher();

console.log(figlet.textSync('homehost'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
