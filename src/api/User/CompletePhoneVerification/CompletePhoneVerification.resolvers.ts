import { 
    CompletePhoneVerificationMutationArgs,
    CompletePhoneVerificationResponse
 } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import Verification from "../../../entities/Verification";


const resolvers: Resolvers = {
    Mutation: {
        CompletePhoneVerification: async (
            _,
            args: CompletePhoneVerificationMutationArgs
        ): Promise<CompletePhoneVerificationResponse> => {
            const { phoneNumber, key } = args;
            try {
                const verification = await Verification.findOne({
                    payload: phoneNumber,
                    key
                });
                if
            }
            catch(error) {
                return {
                    ok: false,
                error: error.message,
                token:null
                }
                
            }
                
            } 
        }
    }
};

export default resolvers;