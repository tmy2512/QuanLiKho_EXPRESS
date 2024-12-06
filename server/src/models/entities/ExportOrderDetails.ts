import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ExportOrders } from './ExportOrders'
import { Goods } from './Goods'

@Index('FK_export_detail_order_idx', ['idExportOrder'], {})
@Index('FK_export_goods_idx', ['idGoods'], {})
@Entity('export_order_details', { schema: 'quanlykho' })
export class ExportOrderDetails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_export_order_details' })
  idExportOrderDetails: number

  @Column('int', { name: 'id_export_order' })
  idExportOrder: number

  @Column('int', { name: 'id_goods' })
  idGoods: number

  @Column('int', { name: 'amount' })
  amount: number

  @ManyToOne(() => ExportOrders, (exportOrders) => exportOrders.exportOrderDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_export_order', referencedColumnName: 'idExportOrders' }])
  idExportOrder2: ExportOrders

  @ManyToOne(() => Goods, (goods) => goods.exportOrderDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_goods', referencedColumnName: 'idGoods' }])
  idGoods2: Goods
}
