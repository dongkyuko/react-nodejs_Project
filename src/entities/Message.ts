import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";

  import Chat from "./Chat";
  import User from "./User";
  
  @Entity()
  class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"text"})
    text: string;


    @Column({nullable:true})
    chatId: number;

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;

    @ManyToOne (type => User, user => user)
    user: User;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
    
  }

  export default Message;

//   type Message {
//     id: Int!
//     text: String!
//     chat: Chat!
//     user: User!
//     createdAt: String!
//     updatedAt: String
// }