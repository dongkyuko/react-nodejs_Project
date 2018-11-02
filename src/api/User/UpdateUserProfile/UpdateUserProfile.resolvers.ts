import User from "../../../entities/User";
import { 
    UpdateUserProfileMutationArgs,
    UpdateUserProfileResponse 
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";
import cleanNullArg from "../../../utils/cleanNullArg";

const resolvers: Resolvers = {
    Mutation: {
        UpdateUserProfile: privateResolver(
            async(
                _, 
                args: UpdateUserProfileMutationArgs,
                { req }
                ): Promise<UpdateUserProfileResponse> => {
                    const user: User = req.user;
                    const notNull: any = cleanNullArg(args);
                    if (notNull.password){
                        user.password =notNull.password
                        user.save();
                        delete notNull.password
                    }
                    console.log(notNull);
                    try {
                        await User.update({ id: user.id}, { ...notNull });
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
        )
    }
};

export default resolvers;