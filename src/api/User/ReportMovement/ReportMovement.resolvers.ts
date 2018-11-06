import User from "../../../entities/User";
import {  
    ReportMovementMutationArgs,
    ReportMovementResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArg from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: privateResolver(
            async(
                _,
                args: ReportMovementMutationArgs,
                { req, pubSub }
            ): Promise<ReportMovementResponse> => {
                const user: User = req.user;
                //입력한 정보만 Array로 정렬
                const notNull = cleanNullArg(args);
                try {
                    // user 위치 정보 업데이트
                    await User.update({ id: user.id }, {...notNull});
                    //Update 된 유저 정보 담기
                    const updatedUser = await User.findOne({id: user.id});
                    // Pubsub 배포 (변수명, 받을 Grpahql 이름)
                    pubSub.publish("driverUpdate", {DriversSubscription: updatedUser});
                    return {
                        ok: true,
                        error: null
                    };
                }
                
                catch (error) {
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