import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ImportOrders } from './ImportOrders'
import { ImportReceipts } from './ImportReceipts'

@Entity('providers', { schema: 'quanlykho' })
export class Providers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_providers' })
  idProviders: number

  @Column('varchar', { name: 'name', length: 100 })
  name: string

  @Column('varchar', { name: 'address', nullable: true, length: 200 })
  address: string | null

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at'
  })
  deletedAt: Date

  @OneToMany(() => ImportOrders, (importOrders) => importOrders.idProvider2)
  importOrders: ImportOrders[]

  @OneToMany(() => ImportReceipts, (importReceipts) => importReceipts.idProvider2)
  importReceipts: ImportReceipts[]
}
