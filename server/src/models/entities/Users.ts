import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

import { ExportReceipts } from './ExportReceipts'
import { ImportReceipts } from './ImportReceipts'
import { PermissionDetails } from './PermissionDetails'
import { StocktakingReceipts } from './StocktakingReceipts'
import { TransportReceipts } from './TransportReceipts'

dotenv.config()

const saltRounds: number = process.env.SALT_ROUNDS !== undefined ? +process.env.SALT_ROUNDS : 10
@Index('phone_UNIQUE', ['phone'], { unique: true })
@Index('email_UNIQUE', ['email'], { unique: true })
@Index('username_UNIQUE', ['username'], { unique: true })
@Entity('users', { schema: 'quanlykho' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_users' })
  idUsers: number

  @Column('varchar', { name: 'name', length: 100 })
  name: string

  @Column('varchar', { name: 'email', length: 45 })
  email: string

  @Column('varchar', { name: 'gender', length: 1 })
  gender: 'M' | 'F' | 'O'

  @Column('varchar', { name: 'phone', length: 12 })
  phone: string

  @Column('date', { name: 'start_date' })
  startDate: string

  @Column('varchar', { name: 'username', unique: true, length: 45 })
  username: string

  @Column('varchar', { name: 'password', length: 255 })
  password: string

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date | null

  @Column('int', { name: 'id_created' })
  idCreated: number

  @Column('int', { name: 'id_updated', nullable: true })
  idUpdated: number | null

  @Column('tinyint', { name: 'disabled', nullable: true, default: () => 0 })
  disabled: number

  @OneToMany(() => ExportReceipts, (exportReceipts) => exportReceipts.idUserExport2)
  exportReceipts: ExportReceipts[]

  @OneToMany(() => ImportReceipts, (importReceipts) => importReceipts.idUserImport2)
  importReceipts: ImportReceipts[]

  @OneToMany(() => PermissionDetails, (permissionDetails) => permissionDetails.idUsers2)
  permissionDetails: PermissionDetails[]

  @OneToMany(() => StocktakingReceipts, (stocktakingReceipts) => stocktakingReceipts.idUser2)
  stocktakingReceipts: StocktakingReceipts[]

  @OneToMany(() => TransportReceipts, (transportReceipts) => transportReceipts.idUserSend2)
  transportReceipts: TransportReceipts[]

  @OneToMany(() => TransportReceipts, (transportReceipts) => transportReceipts.idUserReceive2)
  transportReceipts2: TransportReceipts[]

  hashPassword() {
    const salt = bcrypt.genSaltSync(saltRounds)
    this.password = bcrypt.hashSync(this.password, salt)
  }

  verifyPassword(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}
