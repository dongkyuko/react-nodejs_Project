import jwt from "jsonwebtoken";

//User ID를 넣어서 Token 생성
const createJWT = (id: number) : string =>{
    const token = jwt.sign(
        {
            id
        },
        process.env.JWT_TOKEN || ""
    );
    return token;
};

export default createJWT;