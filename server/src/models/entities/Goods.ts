import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExportOrderDetails } from './ExportOrderDetails'
import { GoodsTypes } from './GoodsTypes'
import { GoodsUnits } from './GoodsUnits'
import { ImportOrderDetails } from './ImportOrderDetails'
import { StocktakingDetails } from './StocktakingDetails'
import { Warehouses } from './Warehouses'
@Index('FK_goods_type_idx', ['idType'], {})
@Index('FK_goods_unit_idx', ['idUnit'], {})
@Index('FK_goods_warehouse_idx', ['idWarehouse'], {})
@Entity('goods', { schema: 'quanlykho' })
export class Goods {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_goods' })
  idGoods: number

  @Column('int', { name: 'id_type' })
  idType: number

  @Column('int', { name: 'id_unit' })
  idUnit: number

  @Column('int', { name: 'id_warehouse' })
  idWarehouse: number

  @Column('varchar', { name: 'name', length: 200 })
  name: string

  @Column('int', { name: 'floor' })
  floor: number

  @Column('int', { name: 'slot' })
  slot: number

  @Column('datetime', { name: 'import_date', nullable: true })
  importDate: Date

  @Column('date', { name: 'exp', nullable: true })
  exp: string

  @Column('int', { name: 'amount' })
  amount: number

  @Column('boolean', { name: 'is_heavy', nullable: true })
  isHeavy: boolean

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

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

  @Column('tinyint', { name: 'disabled' })
  disabled: number

  @OneToMany(() => ExportOrderDetails, (exportOrderDetails) => exportOrderDetails.idGoods2)
  exportOrderDetails: ExportOrderDetails[]

  @ManyToOne(() => GoodsTypes, (goodsTypes) => goodsTypes.goods, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_type', referencedColumnName: 'idGoodsTypes' }])
  idType2: GoodsTypes

  @ManyToOne(() => GoodsUnits, (goodsUnits) => goodsUnits.goods, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_unit', referencedColumnName: 'idGoodsUnits' }])
  idUnit2: GoodsUnits

  @ManyToOne(() => Warehouses, (warehouses) => warehouses.goods, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_warehouse', referencedColumnName: 'idWarehouse' }])
  idWarehouse2: Warehouses

  @OneToMany(() => ImportOrderDetails, (importOrderDetails) => importOrderDetails.idGoods2)
  importOrderDetails: ImportOrderDetails[]

  @OneToMany(() => StocktakingDetails, (stocktakingDetails) => stocktakingDetails.idGoods2)
  stocktakingDetails: StocktakingDetails[]
}
