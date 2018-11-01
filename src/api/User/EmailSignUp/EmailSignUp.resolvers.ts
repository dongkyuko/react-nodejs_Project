import User from "../../../entities/User";
import { 
    EmailSignUpMutationArgs,
    EmailSignUpResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async (
            _,
            args: EmailSignUpMutationArgs
        ):Promise<EmailSignUpResponse> => {
            const { email } = args;
            try {
                const existingUser = await User.findOne({ email });
                //해당 이메일로 유저가 있을 때
                if (existingUser) {
                    return {
                        ok: false,
                        error: "이메일로 가입된 사용자가 있습니다.",
                        token: null
                    };
                }
                // 신규 가입
                else {
                    const newUser = await User.create({ ...args }).save();
                    const token = createJWT(newUser.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    };
                }
            }
            catch(error){
                return {
                    ok:false,
                    error: error.message,
                    token: null
                };
            }
        }
    }
};

export default resolvers;