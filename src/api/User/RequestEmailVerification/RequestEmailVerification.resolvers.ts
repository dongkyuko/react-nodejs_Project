import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { RequestEmailVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";
import { sendVerificationEmail } from "../../../utils/sendEmail";

//privateResolver는 context 값을 가져올때 사용  
const resolvers: Resolvers = {
    Mutation :{
        RequestEmailVerification: privateResolver(
            async (_, __, { req }): Promise<RequestEmailVerificationResponse> => {
                //Request 헤더에 있는 user 값 가져오기
                const user: User = req.user;
                // 사용자가 이메일을 가지고 있다면
                if(user.email) {
                    try{
                        const oldVerification = await Verification.findOne({
                            payload: user.email
                        });
                        //기존의 이메일 인증번호가 있으면 삭제
                        if (oldVerification) {
                            oldVerification.remove();
                        }
                        //새로운 인증번호 생성
                        const newVerification = await Verification.create({
                            payload: user.email,
                            target: "EMAIL"
                        }).save();
                        //새로운 인증번호 생성 후 이메일 보내기
                        await sendVerificationEmail(user.fullname, newVerification.key);
                        return {
                            ok: true,
                            error: null
                        };
                    }
                    catch(error) {
                        return {
                            ok:false,
                            error: error.mesaage
                        };
                    }
                }
                // 사용자가 이메일을 가지고 있지 않다면
                else {
                    return {
                        ok: false,
                        error: "Your user has no email to verify"
                    };
                }
            }
        )
    }
};

export default resolvers;