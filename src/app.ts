import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";

//GraphQL 서버를 생성하고 Express Middleware를 불러오게 설정
class App {
    public app: GraphQLServer;
    constructor() {
        this.app = new GraphQLServer({
            schema
        })
        this.middlewares();
    }
    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
    };
}

export default new App().app;