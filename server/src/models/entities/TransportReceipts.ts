import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TransportDetails } from './TransportDetails'
import { ExportReceipts } from './ExportReceipts'
import { Users } from './Users'
import { Warehouses } from './Warehouses'

@Index('FK_transport_from_user_idx', ['idUserSend'], {})
@Index('FK_transport_from_warehouse_idx', ['idWarehouseFrom'], {})
@Index('FK_transport_to_user_idx', ['idUserReceive'], {})
@Index('FK_transport_to_warehouse_idx', ['idWarehouseTo'], {})
@Entity('transport_receipts', { schema: 'quanlykho' })
export class TransportReceipts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_transport_receipts' })
  idTransportReceipts: number

  @Column('datetime', { name: 'transport_from_date', nullable: true })
  transportFromDate: Date

  @Column('datetime', { name: 'transport_to_date', nullable: true })
  transportToDate: Date

  @Column('int', { name: 'id_warehouse_from' })
  idWarehouseFrom: number

  @Column('int', { name: 'id_warehouse_to' })
  idWarehouseTo: number

  @Column('int', { name: 'id_user_send', nullable: true })
  idUserSend: number

  @Column('int', { name: 'id_user_receive', nullable: true })
  idUserReceive: number

  @Column('varchar', { name: 'plate_number', length: 10, nullable: true })
  plateNumber: string

  @Column('int', { name: 'status' })
  status: number

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @Column('int', { name: 'id_updated', nullable: true })
  idUpdated: number

  @OneToMany(() => TransportDetails, (transportDetails) => transportDetails.idTransportReceipt2)
  transportDetails: TransportDetails[]

  @ManyToOne(() => Users, (users) => users.transportReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_user_send', referencedColumnName: 'idUsers' }])
  idUserSend2: Users

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.transportReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse_from', referencedColumnName: 'idWarehouse' }])
  idWarehouseFrom2: Warehouses

  @ManyToOne(() => Users, (users) => users.transportReceipts2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_user_receive', referencedColumnName: 'idUsers' }])
  idUserReceive2: Users

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.transportReceipts2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse_to', referencedColumnName: 'idWarehouse' }])
  idWarehouseTo2: Warehouses
}
