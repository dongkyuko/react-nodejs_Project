import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: privateResolver(
            async (
                _,
                __,
                { req }
            ):Promise<GetNearbyDriversResponse> => {
                try {
                    //유저 정보 변수
                    const user: User = req.user;
                    //유저 위도, 경도 데이터 변수
                    const { lastLat, lastLng } = user;
                    //유저와 가까운 드라이버 찾기, typeOrm의 API들을 사용하려면 getRepository는 필수
                    const drivers = await getRepository(User).find({
                        isDriving: true,
                        lastLat: Between(lastLat - 0.05, lastLat + 0.05),
                        lastLng: Between(lastLng - 0.05, lastLng + 0.05)
                    });
                    return {
                        ok: true,
                        error: null,
                        drivers
                    };
                }
                catch(error){
                    return {
                        ok: false, 
                        error: error.message,
                        drivers: null
                    };
                }
            }
        )
    }
};

export default resolvers;