import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import { OutboxAttributes } from '../types'

@Table
export class Outbox extends Model implements OutboxAttributes {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataTypes.UUIDV4 })
  id?: string

  @AllowNull(false)
  @Column
  message!: string
}
