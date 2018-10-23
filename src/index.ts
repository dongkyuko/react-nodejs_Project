//dotenv를 최상단에 선언해야 ConnectionOptions에 process.env 가능
import dotenv from "dotenv";
dotenv.config();

import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import ConnectionOptions from "./ormConfig";

// console.log(process.env);

//입력받은 포트로 실행 또는 4000으로 실행
const PORT : number | string =  process.env.PORT || 4000;
//(GrpahQL Playground)
const PLAYGROUND : string = "/playground";
//GraphQL 엔드포인트 설정
const GRAPHQL_ENDPOINT : string = "/graphql";

const appOptions: Options = {
    //포트 설정
    port: PORT,
    //플레이그라운드 설정 (GrpahQL Playground)
    playground: PLAYGROUND,
    //GraphQL 엔드포인트 설정
    endpoint: GRAPHQL_ENDPOINT
}

//서버 시작 후 log 찍어주기
const handelAppstart = () => console.log(`Listen on port ${PORT}`);

//DB연결 후 서버 시작
createConnection(ConnectionOptions)
.then(() => {
    app.start(appOptions, handelAppstart);
})
.catch(error => console.log(error));

// //GraphQL이 동작하는 Express 서버 시작
// app.start(appOptions, handelAppstart);