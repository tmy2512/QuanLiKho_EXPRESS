import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { StocktakingDetails } from './StocktakingDetails'
import { Users } from './Users'
import { Warehouses } from './Warehouses'

@Index('FK_taking_user_idx', ['idUser'], {})
@Index('FK_taking_warehouse_idx', ['idWarehouse'], {})
@Entity('stocktaking_receipts', { schema: 'quanlykho' })
export class StocktakingReceipts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_stocktaking_receipts' })
  idStocktakingReceipts: number

  @Column('datetime', { name: 'date' })
  date: Date

  @Column('int', { name: 'id_warehouse' })
  idWarehouse: number

  @Column('int', { name: 'id_user' })
  idUser: number

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @Column('int', { name: 'id_updated', nullable: true })
  idUpdated: number

  @OneToMany(() => StocktakingDetails, (stocktakingDetails) => stocktakingDetails.idReceipt2)
  stocktakingDetails: StocktakingDetails[]

  @ManyToOne(() => Users, (users) => users.stocktakingReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_user', referencedColumnName: 'idUsers' }])
  idUser2: Users

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.stocktakingReceipts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse', referencedColumnName: 'idWarehouse' }])
  idWarehouse2: Warehouses
}
