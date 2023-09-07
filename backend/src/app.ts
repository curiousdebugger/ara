import express, {Express} from  'express';
import { AraServer } from './setupServer';

class Application {
    public initialize(): void {
        const app : Express = express();
        const server : AraServer = new AraServer(app);
        server.start();
    }
}

const application : Application = new Application();
application.initialize();
