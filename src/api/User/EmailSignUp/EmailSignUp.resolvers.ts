import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { 
    EmailSignUpMutationArgs,
    EmailSignUpResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";
import { sendVerificationEmail } from "../../../utils/sendEmail";

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
                //신규 가입, 핸드폰 인증을 받아야 이메일로 가입가능
                else {
                    // 핸드폰 인증을 받았는지 확인
                    const phoneVerification = await Verification.findOne({
                       payload: args.phoneNumber,
                       verified: true 
                    });
                    //핸드폰 인증을 받았으면 회원가입 진행
                    if(phoneVerification) {
                        const newUser = await User.create({ ...args }).save();
                        // 새로가입한 유저의 이메일이 있으면 이메일 인증번호 생성 후 사용자에 이메일 전송
                        //console.log(newUser.email);
                        if(newUser.email) {
                            const emailVerification = await Verification.create({
                                payload: newUser.email,
                                target: "EMAIL"
                            }).save();
                            //사용자 풀네임과 이메일 키의 정보를 가져와 사용자에게 이메일 전송
                            await sendVerificationEmail(
                                newUser.fullname,
                                emailVerification.key
                            );
                        }
                        //토큰 생성
                        const token = createJWT(newUser.id);
                        return {
                            ok: true,
                            error: null,
                            token
                        };
                    }
                    //핸드폰 인증을 받지 않았다면
                    else {
                        return {
                            ok:false,
                            error: "You haven't verified your phone number",
                            token: null
                        };
                    }
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