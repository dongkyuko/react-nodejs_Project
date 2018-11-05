import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from "typeorm";

  //관계가 있는 모델 무르기
  import User from "./User";

@Entity()
class Place extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"text"})
    name: string;

    @Column({type:"double precision", default:0})
    lat: number;

    @Column({type:"double precision", default:0})
    lng: number;

    @Column({type:"text"})
    address: string;

    @Column({type:"boolean", default:false})
    isFav: boolean;

    @Column({nullable: true})
    userId: number;

    @ManyToOne(type => User, user => user.places)
    user: User;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}

export default Place;

// type Place {
//     id: Int!
//     name: String!
//     lat: Float!
//     lng: Float!
//     address: String!
//     isFav: Boolean!
//     user: User!
//     createdAt: String!
//     updatedAt: String
// }