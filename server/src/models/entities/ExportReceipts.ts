import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Goods } from './Goods'
import { ExportOrders } from './ExportOrders'
import { Users } from './Users'
import { Warehouses } from './Warehouses'
import { TransportReceipts } from './TransportReceipts'
import { TransportDetails } from './TransportDetails'

@Index('FK_out_receipt_order_idx', ['idExportOrder'], {})
@Index('FK_out_receipt_user_idx', ['idUserExport'], {})
@Index('FK_out_receipt_warehouse_idx', ['idWarehouse'], {})
@Entity('export_receipts', { schema: 'quanlykho' })
export class ExportReceipts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_export_receipts' })
  idExportReceipts: number

  @Column('int', { name: 'id_warehouse' })
  idWarehouse: number

  @Column('int', { name: 'id_export_order' })
  idExportOrder: number

  @Column('int', { name: 'id_user_export' })
  idUserExport: number

  @Column('datetime', {
    name: 'export_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  exportDate: Date | null

  @Column('int', { name: 'pallet_code' })
  palletCode: number

  @Column('int', { name: 'status' })
  status: number

  @Column('varchar', { name: 'reason_failed', length: 200, nullable: true })
  reasonFailed: string

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @Column('int', { name: 'id_updated', nullable: true })
  idUpdated: number

  @ManyToOne(() => ExportOrders, (exportOrders) => exportOrders.exportReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_export_order', referencedColumnName: 'idExportOrders' }])
  idExportOrder2: ExportOrders

  @ManyToOne(() => Users, (users) => users.exportReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_user_export', referencedColumnName: 'idUsers' }])
  idUserExport2: Users

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.exportReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse', referencedColumnName: 'idWarehouse' }])
  idWarehouse2: Warehouses

  @OneToMany(() => TransportDetails, (transportDetails) => transportDetails.idExportReceipt2)
  transportDetails: TransportDetails[]
}
