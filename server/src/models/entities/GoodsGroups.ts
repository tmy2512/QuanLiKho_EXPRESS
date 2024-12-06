import { Column, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GoodsTypes } from './GoodsTypes';

@Index('name_UNIQUE', ['name'], { unique: true })
@Entity('goods_groups', { schema: 'quanlykho' })
export class GoodsGroups {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_goods_groups' })
  idGoodsGroups: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string | null;

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => GoodsTypes, (goodsTypes) => goodsTypes.idGoodsGroup2)
  goodsTypes: GoodsTypes[];
}
