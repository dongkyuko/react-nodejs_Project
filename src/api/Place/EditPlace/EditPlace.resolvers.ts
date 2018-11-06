import Place from "../../../entities/Place";
import User from "../../../entities/User";
import {  
    EditPlaceMutationArgs,
    EditPlaceResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArg from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Mutation: {
        EditPlace: privateResolver(
            async (
                _,
                args: EditPlaceMutationArgs,
                { req }
            ):Promise<EditPlaceResponse> => {
                //유저 정보 담기
                const user: User = req.user;
                try {
                    //Place 정보 찾기
                    const place = await Place.findOne({ id: args.placeId });
                    //Place 정보가 있다면
                    if (place){
                        //Place 정보의 유저 ID와 현재 로그인한 유저 ID가 같다면
                        if(place.userId === user.id) {
                            const notNull = cleanNullArg(args);
                            await Place.update({id: args.placeId}, {...notNull});
                            return {
                                ok: true,
                                error: null
                            };
                        } 
                        // PLace 정보의 유저 ID와 현재 로그인한 유저 ID가 다르다면
                        else {
                            return {
                                ok: false,
                                error: "Not Authorized"
                            };
                        }
                    }
                    //Place 정보가 없다면
                    else {
                        return {
                            ok: false,
                            error: "Place not Found"
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