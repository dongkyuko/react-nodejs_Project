import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        DriversSubscription: {
            //구독으로 선언
            subscribe: withFilter(
                // 구독할 데이터 선언
                (_, __, { pubSub }) => pubSub.asyncIterator("driverUpdate"),
                // Filter 설정
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        DriversSubscription: {
                            lastLat: driverLastLat,
                            lastLng: driverLastLng
                        } 
                    } = payload;
                    const {lastLat: userLastLat, lastLng: userLastLng} = user;
                    return (
                        driverLastLat >= userLastLat - 0.05 &&
                        driverLastLat <= userLastLat + 0.05 &&
                        driverLastLng >= userLastLng -0.05 &&
                        driverLastLng <= userLastLng +0.05 
                    );
                } 
            )
        }
    }
};

export default resolvers;