import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import {
    CompleteEmailVerificationMutationArgs,
    CompleteEmailVerificationResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";

const resolver: Resolvers = {
    Mutation: {
        CompleteEmailVerification: privateResolver(
            async (
                _,
                args: CompleteEmailVerificationMutationArgs,
                { req }
            ): Promise<CompleteEmailVerificationResponse> => {
                const user: User = req.user;
                const { key } = args;
                //사용자가 이메일을 정보를 가지고 있고 이메일 인증이 false인 경우
                if (user.email && !user.verifiedEmail) {
                    try {
                        //사용자 발급된 이메일 인증번호를 맞게 입력했는지 확인
                        const verification = await Verification.findOne({
                            key,
                            payload: user.email
                        });
                        //인증번호를 올바르게 입력했을 경우
                        if(verification) {
                            user.verifiedEmail = true;
                            user.save();
                            return {
                                ok: true,
                                error: null
                            };
                        }
                        //인증번호를 올바르게 입력하지 않았을 경우
                        else {
                            return {
                                ok: false,
                                error: "Can't verify email"
                            };
                        }
                    } 
                    catch(error) {
                      return {
                          ok:false,
                          error: error.message
                      }; 
                    }
                }
                //사용자가 이메일을 정보를 가지고 있지 않고 이메일 인증이 True인 경우
                else {
                    return {
                        ok: false,
                        error: "No email to verify"
                    };
                }
            }
        )
    }
};

export default resolver;