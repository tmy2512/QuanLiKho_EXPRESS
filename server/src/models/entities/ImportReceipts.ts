import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ImportOrders } from './ImportOrders'
import { Providers } from './Providers'
import { Users } from './Users'
import { Warehouses } from './Warehouses'

@Index('FK_in_receipt_order_idx', ['idImportOrder'], {})
@Index('FK_in_receipt_provider_idx', ['idProvider'], {})
@Index('FK_in_receipt_user_idx', ['idUserImport'], {})
@Index('FK_in_receipt_warehouse_idx', ['idWarehouse'], {})
@Entity('import_receipts', { schema: 'quanlykho' })
export class ImportReceipts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_import_receipts' })
  idImportReceipts: number

  @Column('int', { name: 'id_warehouse' })
  idWarehouse: number

  @Column('int', { name: 'id_import_order' })
  idImportOrder: number

  @Column('int', { name: 'id_provider' })
  idProvider: number

  @Column('int', { name: 'id_user_import' })
  idUserImport: number

  @Column('datetime', {
    name: 'import_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  importDate: Date | null

  @Column('int', { name: 'status' })
  status: number

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date | null

  @Column('int', { name: 'id_updated', nullable: true })
  idUpdated: number | null

  @ManyToOne(() => ImportOrders, (importOrders) => importOrders.importReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_import_order', referencedColumnName: 'idImportOrders' }])
  idImportOrder2: ImportOrders

  @ManyToOne(() => Providers, (providers) => providers.importReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_provider', referencedColumnName: 'idProviders' }])
  idProvider2: Providers

  @ManyToOne(() => Users, (users) => users.importReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_user_import', referencedColumnName: 'idUsers' }])
  idUserImport2: Users

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.importReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse', referencedColumnName: 'idWarehouse' }])
  idWarehouse2: Warehouses
}
