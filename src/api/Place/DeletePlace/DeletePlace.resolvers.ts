import Place from "../../../entities/Place";
import User from "../../../entities/User";
import {
    DeletePlaceMutationArgs,
    DeletePlaceResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Mutation: {
        DeletePlace: privateResolver(
            async(
                _,
                args: DeletePlaceMutationArgs,
                { req }
            ):Promise<DeletePlaceResponse> => {
                const user: User = req.user;
                try {
                    const place = await Place.findOne({ id: args.placeId });
                    //Place가 있다면
                    if(place) {
                        //Place의 userId 정보와 user ID가 맞으면
                        if(place.userId === user.id){
                            place.remove();
                            return {
                                ok: true,
                                error: null
                            };
                        }
                        //Place의 userId 정보와 user ID가 맞지 않으면
                        else {
                            return {
                                ok: false,
                                error: null
                            }
                        }
                    }
                    //Place가 없다면
                    else {
                        return {
                            ok: false,
                            error: "Place Not Found"
                        };
                    }
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
