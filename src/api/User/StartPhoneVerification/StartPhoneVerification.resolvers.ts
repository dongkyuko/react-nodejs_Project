import Verification from "../../../entities/Verification";
import { 
StartPhoneVerificationMutationArgs,
StartPhoneVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { sendVerificationSMS } from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation : {
        StartPhoneVerification : async (
            _,
            args: StartPhoneVerificationMutationArgs
        ): Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {
                const existingVerification = await Verification.findOne({payload: phoneNumber});
                //핸드폰 번호에 인증받은 번호가 있을 때 
                if (existingVerification) {
                    existingVerification.remove();
                }
                // 인증번호 생성
                const newVerification = await Verification.create({
                    payload: phoneNumber,
                    target: "PHONE"
                }).save();
                //인증번호 보내기
                console.log(newVerification);
                await sendVerificationSMS(newVerification.payload, newVerification.key);
                return {
                    ok: true,
                    error: null
                }; 
            }
            catch(error) {
                return {
                    ok: false,
                    error: error.message
                };
            }
        }
    }
};

export default resolvers;