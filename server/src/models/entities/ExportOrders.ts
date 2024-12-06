import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExportOrderDetails } from './ExportOrderDetails'
import { ExportReceipts } from './ExportReceipts'

@Entity('export_orders', { schema: 'quanlykho' })
export class ExportOrders {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_export_orders' })
  idExportOrders: number

  @Column('datetime', { name: 'order_date' })
  orderDate: Date

  // @Column('varchar', { name: 'customer_name', length: 100 })
  // customerName: string

  // @Column('varchar', { name: 'phone', length: 12 })
  // phone: string

  @Column('varchar', { name: 'province_code', length: 2 })
  provinceCode: string

  @Column('varchar', { name: 'district_code', length: 3 })
  districtCode: string

  @Column('varchar', { name: 'ward_code', length: 5 })
  wardCode: string

  @Column('varchar', { name: 'address', length: 100 })
  address: string

  @Column('int', { name: 'status' })
  status: number

  @OneToMany(() => ExportOrderDetails, (exportOrderDetails) => exportOrderDetails.idExportOrder2)
  exportOrderDetails: ExportOrderDetails[]

  @OneToMany(() => ExportReceipts, (exportReceipts) => exportReceipts.idExportOrder2)
  exportReceipts: ExportReceipts[]
}
