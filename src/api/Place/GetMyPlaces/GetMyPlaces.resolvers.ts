import User from "../../../entities/User";
import { GetMyPlacesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolvers from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Query: {
        GetMyPlaces: privateResolvers(
            async(
                _,
                __,
                { req }
            ):Promise<GetMyPlacesResponse> => {
                try {
                    const user = await User.findOne(
                        { id: req.user.id },
                        { relations: ["places"] }
                    );
                    //console.log(user);
                    //유저가 있다면
                    if(user){
                        return {
                            ok: true,
                            places: user.places,
                            error: null
                        };
                    }
                    //유저가 없다면
                    else{
                        return {
                            ok: false,
                            places: null,
                            error: "User Not Found"
                        };
                    }
                }
                catch(error) {
                    return {
                        ok: false,
                        error: error.message,
                        places: null
                    };
                }
            }
        )
    }
};

export default resolvers;

