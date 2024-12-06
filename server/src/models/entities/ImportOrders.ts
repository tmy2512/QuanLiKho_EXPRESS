import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ImportOrderDetails } from './ImportOrderDetails'
import { ImportReceipts } from './ImportReceipts'
import { Providers } from './Providers'

@Index('FK_import_provider_idx', ['idProvider'], {})
@Entity('import_orders', { schema: 'quanlykho' })
export class ImportOrders {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_import_orders' })
  idImportOrders: number

  @Column('datetime', { name: 'order_date' })
  orderDate: Date

  @Column('int', { name: 'id_provider' })
  idProvider: number

  @Column('int', { name: 'status' })
  status: number

  @Column('varchar', { name: 'reason_failed', length: 200, nullable: true })
  reasonFailed: string

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

  @Column('int', { name: 'pallet_code' })
  palletCode: number

  @OneToMany(() => ImportOrderDetails, (importOrderDetails) => importOrderDetails.idImportOrder2)
  importOrderDetails: ImportOrderDetails[]

  @ManyToOne(() => Providers, (providers) => providers.importOrders, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_provider', referencedColumnName: 'idProviders' }])
  idProvider2: Providers

  @OneToMany(() => ImportReceipts, (importReceipts) => importReceipts.idImportOrder2)
  importReceipts: ImportReceipts[]
}
