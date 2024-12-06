import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Permissions } from './Permissions'
import { Users } from './Users'

@Index('FK_permission_detail_idx', ['idPermission'], {})
@Index('FK_user_detail_idx', ['idUsers'], {})
@Entity('permission_details', { schema: 'quanlykho' })
export class PermissionDetails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_permission_details' })
  idPermissionDetails: number

  @Column('int', { name: 'id_permission' })
  idPermission: number

  @Column('int', { name: 'id_users' })
  idUsers: number

  @ManyToOne(() => Permissions, (permissions) => permissions.permissionDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_permission', referencedColumnName: 'idPermissions' }])
  idPermission2: Permissions

  @ManyToOne(() => Users, (users) => users.permissionDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn([{ name: 'id_users', referencedColumnName: 'idUsers' }])
  idUsers2: Users
}
