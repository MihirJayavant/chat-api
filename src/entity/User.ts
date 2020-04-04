import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Length, IsNotEmpty } from 'class-validator'
import * as bcrypt from 'bcryptjs'
import { IUserEntity } from '../models'

@Entity()
@Unique(['username'])
export class User implements IUserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(4, 20)
  username: string

  @Column()
  @Length(2, 100)
  firstname: string

  @Column()
  @Length(2, 100)
  lastname: string

  @Column()
  @Length(4, 100)
  password: string

  @Column()
  @IsNotEmpty()
  role: string

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8)
  }

  async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return await bcrypt.compare(unencryptedPassword, this.password)
  }
}
