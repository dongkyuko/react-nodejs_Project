import { GraphQLServer, PubSub } from "graphql-yoga";
import cors from "cors";
import { NextFunction, Response } from "express";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

//GraphQL 서버를 생성하고 Express Middleware를 불러오게 설정
class App {
    public app: GraphQLServer;
    //subscription 정의, 제품화 단계에서는 레디스나 멤캐시를 써야함
    public pubSub: any;
    constructor() {
        //PubSub 정의
        this.pubSub = new PubSub();
        //pubSub 메모리 관리
        this.pubSub.ee.setMaxListeners(99);
        //Graphql 전달값 정의
        this.app = new GraphQLServer({
            schema,
            context: req => {
                //context 변수에 유저 정보 담기
                const { connection: { context = null } = {} } = req;
                //console.log(context);
                return {
                    req: req.request,
                    // Subscription 을 위한 변수
                    pubSub: this.pubSub,
                    // Websocket의 유저 정보
                    context
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
            //Request user에 user 정보 넣기
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
