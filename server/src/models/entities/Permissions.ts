import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { PermissionDetails } from './PermissionDetails'

@Entity('permissions', { schema: 'quanlykho' })
export class Permissions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_permissions' })
  idPermissions: number

  @Column('varchar', { name: 'name', length: 200 })
  name: string

  @OneToMany(() => PermissionDetails, (permissionDetails) => permissionDetails.idPermission2)
  permissionDetails: PermissionDetails[]
}
