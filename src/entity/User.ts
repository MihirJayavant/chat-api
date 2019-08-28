import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import * as bcrypt from "bcryptjs";
import { IUser } from "../models";
  
  @Entity()
  @Unique(["username"])
  export class User implements IUser {
      
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(2, 100)
    firstname: string;

    @Column()
    @Length(2, 100)
    lastname: string;
  
    @Column()
    @Length(4, 100)
    password: string;
  
    @Column()
    @IsNotEmpty()
    role: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
  }