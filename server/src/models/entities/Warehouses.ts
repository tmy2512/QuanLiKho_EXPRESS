import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExportReceipts } from './ExportReceipts'
import { Goods } from './Goods'
import { ImportReceipts } from './ImportReceipts'
import { StocktakingReceipts } from './StocktakingReceipts'
import { TransportReceipts } from './TransportReceipts'

@Index('name_UNIQUE', ['name'], { unique: true })
@Entity('warehouses', { schema: 'quanlykho' })
export class Warehouses {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_warehouse' })
  idWarehouse: number

  @Column('varchar', { name: 'name', length: 100 })
  name: string

  @Column('varchar', { name: 'address', length: 200 })
  address: string

  @Column('varchar', { name: 'province_code', length: 3 })
  provinceCode: string

  @Column('int', { name: 'total_floors' })
  totalFloors: number

  @Column('int', { name: 'total_slots' })
  totalSlots: number

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

  @OneToMany(() => ExportReceipts, (exportReceipts) => exportReceipts.idWarehouse2)
  exportReceipts: ExportReceipts[]

  @OneToMany(() => Goods, (goods) => goods.idWarehouse2)
  goods: Goods[]

  @OneToMany(() => ImportReceipts, (importReceipts) => importReceipts.idWarehouse2)
  importReceipts: ImportReceipts[]

  @OneToMany(() => StocktakingReceipts, (stocktakingReceipts) => stocktakingReceipts.idWarehouse2)
  stocktakingReceipts: StocktakingReceipts[]

  @OneToMany(() => TransportReceipts, (transportReceipts) => transportReceipts.idWarehouseFrom2)
  transportReceipts: TransportReceipts[]

  @OneToMany(() => TransportReceipts, (transportReceipts) => transportReceipts.idWarehouseTo2)
  transportReceipts2: TransportReceipts[]
}
