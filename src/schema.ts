//각 폴더에 있는 스키마 합치는 작업
//스키마란? 데이터베이스를 구성하는 레코드의 크기, 키(key)의 정의, 레코드와 레코드의 관계, 검색 방법 등을 정의한 것.
// import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

//api 폴더에 있는 .graphql 파일 모두 가져오기, 배열로 담겨 있음
const allTypes: string[] = fileLoader(
    path.join(__dirname, "./api/**/*.graphql")
);

//api 폴더에 있는 .resolvers. 파일 모두 가져오기, 배열로 담겨 있음
const allResolvers: any[] = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*")
);

//Type과 Resolvers 합치기
const mergedTypes : any = mergeTypes(allTypes);
const mergedResolvers : any = mergeResolvers(allResolvers);

//최종적으로 스키마 만들기
const schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: mergedResolvers
});

export default schema;