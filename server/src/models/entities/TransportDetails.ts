import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TransportReceipts } from './TransportReceipts'
import { ExportReceipts } from './ExportReceipts'
@Index('FK_transport_export_order_idx', ['idExportReceipt'], {})
@Index('FK_transport_detail_receipt_idx', ['idTransportReceipt'], {})
@Entity('transport_details', { schema: 'quanlykho' })
export class TransportDetails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_transport_details' })
  idTransportDetails: number

  @Column('int', { name: 'id_transport_receipt' })
  idTransportReceipt: number

  @Column('int', { name: 'id_export_receipt' })
  idExportReceipt: number

  @ManyToOne(() => ExportReceipts, (exportReceipts) => exportReceipts.transportDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_export_receipt', referencedColumnName: 'idExportReceipts' }])
  idExportReceipt2: ExportReceipts

  @ManyToOne(() => TransportReceipts, (transportReceipts) => transportReceipts.transportDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([
    {
      name: 'id_transport_receipt',
      referencedColumnName: 'idTransportReceipts'
    }
  ])
  idTransportReceipt2: TransportReceipts
}
