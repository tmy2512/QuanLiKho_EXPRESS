import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Goods } from './Goods'
import { GoodsGroups } from './GoodsGroups'
@Index('name_UNIQUE', ['name'], { unique: true })
@Index('FK_goods_type_group_idx', ['idGoodsGroup'], {})
@Entity('goods_types', { schema: 'quanlykho' })
export class GoodsTypes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_goods_types' })
  idGoodsTypes: number

  @Column('int', { name: 'id_goods_group' })
  idGoodsGroup: number

  @Column('varchar', { name: 'name', length: 45 })
  name: string

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at'
  })
  deletedAt: Date
  @OneToMany(() => Goods, (goods) => goods.idType2)
  goods: Goods[]

  @ManyToOne(() => GoodsGroups, (goodsGroups) => goodsGroups.goodsTypes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_goods_group', referencedColumnName: 'idGoodsGroups' }])
  idGoodsGroup2: GoodsGroups
}
