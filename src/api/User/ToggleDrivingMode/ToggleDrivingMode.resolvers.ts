import User from "../../../entities/User";
import { ToggleDrivingModeResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolvers from "../../../utils/privateResolvers";

const resolver: Resolvers = {
    Mutation: {
        //Context 에서 불러오기 때문에 privateResolvers 활용
        ToggleDrivingMode: privateResolvers(
            async(_, __, { req }): Promise<ToggleDrivingModeResponse> => {
                //req 헤더의 유저 정보를 받아 user에 저장
                const user: User = req.user;
                //isDriving 을 True로 변경 후 저장
                user.isDriving = !user.isDriving;
                user.save();
                return {
                    ok: true,
                    error: null
                };
            }
        )
    }
};

export default resolver;