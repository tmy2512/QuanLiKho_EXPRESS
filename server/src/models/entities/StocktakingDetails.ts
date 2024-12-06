import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Goods } from './Goods'
import { StocktakingReceipts } from './StocktakingReceipts'

@Index('FK_taking_detail_goods_idx', ['idGoods'], {})
@Index('FK_taking_detail_receipt_idx', ['idReceipt'], {})
@Entity('stocktaking_details', { schema: 'quanlykho' })
export class StocktakingDetails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_stocktaking_details' })
  idStocktakingDetails: number

  @Column('int', { name: 'id_receipt' })
  idReceipt: number

  @Column('int', { name: 'id_goods' })
  idGoods: number

  @Column('int', { name: 'amount' })
  amount: number

  @Column('int', { name: 'stored_amount' })
  storedAmount: number

  @Column('varchar', { name: 'quality', length: 45 })
  quality: string

  @Column('varchar', { name: 'solution', length: 100, nullable: true })
  solution: string

  @ManyToOne(() => Goods, (goods) => goods.stocktakingDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_goods', referencedColumnName: 'idGoods' }])
  idGoods2: Goods

  @ManyToOne(() => StocktakingReceipts, (stocktakingReceipts) => stocktakingReceipts.stocktakingDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_receipt', referencedColumnName: 'idStocktakingReceipts' }])
  idReceipt2: StocktakingReceipts
}
