import User from "../../../entities/User";
import {
    FacebookConnectMutationArgs,
    FacebookConnectResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
    Mutation: {
        FacebookConnect: async (
            _,
            args: FacebookConnectMutationArgs
        ): Promise<FacebookConnectResponse> => {
            const { fbId } = args;
            //유저가 있으면 로그인
            try {
                const existingUser = await User.findOne({ fbId });
                if (existingUser) {
                    return {
                        ok: true,
                        error: null,
                        token: "Coming soon, already"
                    };
                }
            } 
            //에러 처리
            catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }
            //유저가 없으면 생성 후 로그인
            try {
                await User.create ({
                    ...args,
                    profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`
                }).save();
                return {
                    ok: true,
                    error: null,
                    token: "Coming soon, created"
                }
            } 
            //에러 처리
            catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }
        }
    }
};

export default resolvers;