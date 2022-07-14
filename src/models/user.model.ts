import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import { UserAttributes } from '../types'

@Table
export class User extends Model implements UserAttributes {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataTypes.UUIDV4 })
  id?: string

  @AllowNull(false)
  @Column
  email!: string
}
