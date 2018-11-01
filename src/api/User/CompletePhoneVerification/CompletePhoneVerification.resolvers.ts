import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { 
    CompletePhoneVerificationMutationArgs,
    CompletePhoneVerificationResponse
 } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        CompletePhoneVerification: async (
            _,
            args: CompletePhoneVerificationMutationArgs
        ): Promise<CompletePhoneVerificationResponse> => {
            const { phoneNumber, key } = args;
            try {
                //사용자가 인증번호를 제대로 입력했는지 확인
                const verification = await Verification.findOne({
                    payload: phoneNumber,
                    key
                });
                //사용자가 입력한 인증번호가 틀렸을 때
                if (!verification) {
                    return {
                        ok: false,
                        error: "인증번호 틀림",
                        token: null
                    };
                }
                //사용자가 입력한 인증번호가 맞았을 때
                else { 
                    verification.verified = true;
                    verification.save();
                }
            }
            //에러 처리
            catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token:null
                };
            }
            try {
                const user = await User.findOne({ phoneNumber });
                //인증받은 핸드폰번호에 유저가 있을 때
                console.log(user);
                if(user) {
                    user.verifiedPhoneNumber = true;
                    user.save();
                    const token = createJWT(user.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    };
                }
                //인증받은 핸드폰번호에 유저가 없을 때
                else {
                    return {
                        ok: true,
                        error: null,
                        token: null
                    };
                }
            }
            //에러 처리
            catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token:null
                };
            }
        } 
    }
};

export default resolvers;