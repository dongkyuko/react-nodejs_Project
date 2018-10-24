import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from "typeorm";

//사용자 정의 타입 부르기
import { rideStatus } from "../types/types";

//DB 관계를 위해 엔티티 불러오기
import User from "./User";

@Entity()
class Ride extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  //사용자 정의 타입 부르기
  @Column({
    type:"text", 
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"]
})
  status:rideStatus;

  @Column({type:"text"})
  pickUpaddress:string;

  @Column({type:"double precision", default:0})
  pickUpLat: number;

  @Column({type:"double precision", default:0})
  pickUpLng: number;

  @Column({type:"text"})
  dropOffAddress:string;

  @Column({type:"double precision", default:0})
  dropOffLat: number;

  @Column({type:"double precision", default:0})
  dropOffLng: number;

  @Column({type:"double precision", default:0})
  price: number;

  @Column({type:"text"})
  distance:string;

  @Column({type:"text"})
  duration:string;

  @ManyToOne(type => User, user => user.ridesAsDriver)
  driver: User;

  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;
  
  @CreateDateColumn()
  createdAt:string;

  @UpdateDateColumn()
  updatedAt:string;

}

export default Ride;

// type Ride {
//   id: Int!
//   status: String!
//   pickUpaddress: String!
//   pickUpLat: Float!
//   pickUpLng: Float!
//   dropOffAddress: String!
//   dropOffLat: Float!
//   dropOffLng: Float!
//   price: Float!
//   distance: String!
//   duration: String!
//   driver: User!
//   passenger: User!
//   createdAt: String!
//   updatedAt: String
// }