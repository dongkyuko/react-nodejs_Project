import User from "../../../entities/User";
import {
    EmailSignInMutationArgs,
    EmailSignInResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignIn: async (
            _,
            args: EmailSignInMutationArgs
        ): Promise<EmailSignInResponse> => {
            const { email, password } = args;
            try {
                const user = await User.findOne({ email });
                //유저가 없을 때
                if(!user) {
                    return {
                        ok: false,
                        error: "No User Found with that email",
                        token: null
                    };
                }

                //비밀번호 체크
                const checkPassword = await user.comparePassword(password);
                const token = createJWT(user.id);
            
                //비밀번호가 맞았을 때
                if (checkPassword) {
                    return {
                        ok: true,
                        error: null,
                        token
                    }
                } 
                //비밀번호가 틀렸을 때
                else {
                    return {
                        ok: false,
                        error: "Wrong Password",
                        token: null
                    }
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