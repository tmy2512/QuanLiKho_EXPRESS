import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

import { ExportOrderDetails } from '~/models/entities/ExportOrderDetails'
import { ExportOrders } from '~/models/entities/ExportOrders'
import { ExportReceipts } from '~/models/entities/ExportReceipts'
import { Goods } from '~/models/entities/Goods'
import { GoodsGroups } from '~/models/entities/GoodsGroups'
import { GoodsTypes } from '~/models/entities/GoodsTypes'
import { GoodsUnits } from '~/models/entities/GoodsUnits'
import { ImportOrderDetails } from '~/models/entities/ImportOrderDetails'
import { ImportOrders } from '~/models/entities/ImportOrders'
import { ImportReceipts } from '~/models/entities/ImportReceipts'
import { PermissionDetails } from '~/models/entities/PermissionDetails'
import { Permissions } from '~/models/entities/Permissions'
import { Providers } from '~/models/entities/Providers'
import { StocktakingDetails } from '~/models/entities/StocktakingDetails'
import { StocktakingReceipts } from '~/models/entities/StocktakingReceipts'
import { TransportDetails } from '~/models/entities/TransportDetails'
import { TransportReceipts } from '~/models/entities/TransportReceipts'
import { Users } from '~/models/entities/Users'
import { Warehouses } from '~/models/entities/Warehouses'

dotenv.config()

export const appDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_ADDON_HOST,
  port: Number(process.env.MYSQL_ADDON_PORT),
  username: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  synchronize: true,
  logging: false,
  entities: [
    Users,
    Warehouses,
    TransportReceipts,
    TransportDetails,
    StocktakingReceipts,
    StocktakingDetails,
    Providers,
    Permissions,
    PermissionDetails,
    ImportReceipts,
    ImportOrders,
    ImportOrderDetails,
    Goods,
    GoodsGroups,
    GoodsTypes,
    GoodsUnits,
    ExportReceipts,
    ExportOrders,
    ExportOrderDetails
  ],
  subscribers: [],
  migrations: []
})
