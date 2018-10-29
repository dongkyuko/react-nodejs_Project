import Verification from "../../../entities/Verification";
import { 
StartPhoneVerificationMutationArgs,
StartPhoneVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
    Mutation : {
        StartPhoneVerification : async (
            _,
            args: StartPhoneVerificationMutationArgs
        ): Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            //인증받은 번호가 있을 때
            try {
                const existingVerification = await Verification.findOne({payload: phoneNumber});
                if (existingVerification) {
                    existingVerification.remove();
                }
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