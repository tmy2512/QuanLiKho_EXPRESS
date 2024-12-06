import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ImportOrders } from './ImportOrders'
import { Goods } from './Goods'

@Index('FK_import_order_detail_idx', ['idImportOrder'], {})
@Index('FK_order_goods_idx', ['idGoods'], {})
@Entity('import_order_details', { schema: 'quanlykho' })
export class ImportOrderDetails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_import_order_details' })
  idImportOrderDetails: number

  @Column('int', { name: 'id_import_order' })
  idImportOrder: number

  @Column('int', { name: 'id_goods' })
  idGoods: number

  @Column('int', { name: 'amount' })
  amount: number

  @Column('date', { name: 'exp', nullable: true })
  exp: string

  @ManyToOne(() => ImportOrders, (importOrders) => importOrders.importOrderDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_import_order', referencedColumnName: 'idImportOrders' }])
  idImportOrder2: ImportOrders

  @ManyToOne(() => Goods, (goods) => goods.importOrderDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_goods', referencedColumnName: 'idGoods' }])
  idGoods2: Goods
}
