import jwt from "jsonwebtoken";
import User from "../entities/User";

const decodeJWT = async (token: string): Promise <User | undefined> => {
    try {
        //Decode 후 유저 찾고 유저 정보 리턴
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
        // console.log(decoded);
        const { id } = decoded;
        const user =await User.findOne({ id });
        return user;
    }
    // 에러 처리
    catch(error) {
        return undefined;
    }
};

export default decodeJWT;