import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";

//유저 정보 가져오기
const resolvers: Resolvers = {
    Query: {
        GetMyProfile: privateResolver(async (_, __, { req }) => {
            const { user } = req;
            return {
                ok: true,
                error: null,
                user
            };
        })
    }
};

export default resolvers;