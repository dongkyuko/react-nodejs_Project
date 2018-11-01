import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import { NextFunction, Response } from "express";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

//GraphQL 서버를 생성하고 Express Middleware를 불러오게 설정
class App {
    public app: GraphQLServer;
    constructor() {
        //Graphql 전달값 정의
        this.app = new GraphQLServer({
            schema,
            context: req => {
                return {
                    req: req.request
                };
            }
        });
        this.middlewares();
    }
    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt);
    };

    private jwt = async (
        req, 
        res: Response, 
        next: NextFunction
        ): Promise<void> => {
        const token = req.get("X-JWT");
        if (token) {
            const user = await decodeJWT(token);
            //Request user에 user 정보 확인
            if(user) {
                req.user = user;
            } else {
                req.user = undefined;
            }
        }
        next();
    };
}

export default new App().app;
