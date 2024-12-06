export interface iNavbarItem {
    label: string;
    to: string;
    children?: iNavbarItem[];
    roleIds: number[];
}

const navbar_items: iNavbarItem[] = [
    {
        label: "Danh mục kho",
        to: "#",
        roleIds: [1, 2, 3, 4, 6],
        children: [
            {
                label: "Danh sách kho hàng",
                to: "/list/warehouses",
                roleIds: [2, 3, 6],
            },
            {
                label: "Đặt hàng từ NCC",
                to: "/list/import-orders",
                roleIds: [1, 2, 3, 4, 6],
            },
            {
                label: "Nhập kho",
                to: "/list/import-receipts",
                roleIds: [1, 2, 4, 6],
            },
            {
                label: "Xuất kho",
                to: "/list/export-receipts",
                roleIds: [1, 2, 4, 6],
            },
            {
                label: "Xử lý đơn hàng",
                to: "/list/processor",
                roleIds: [1, 2, 4, 6],
            },
            {
                label: "Điều chuyển kho",
                to: "/list/transport",
                roleIds: [1, 2, 4, 6],
            },
        ],
    },
    {
        label: "Danh mục hàng",
        to: "#",
        roleIds: [1, 2, 3, 4, 6],
        children: [
            {
                label: "Nhà cung cấp",
                to: "/list/providers",
                roleIds: [2, 3, 6],
            },
            {
                label: "Hàng hoá",
                to: "/list/goods",
                roleIds: [1, 3, 4, 6],
            },
            {
                label: "Các thuộc tính hàng hoá",
                to: "/list/goods-props",
                roleIds: [1, 3, 4, 6],
            },
        ],
    },
    {
        label: "Báo cáo / Kiểm kê",
        to: "#",
        roleIds: [2, 3, 4, 6],
        children: [
            {
                label: "Kiểm kê kho",
                to: "/list/stocktaking",
                roleIds: [2, 3, 4, 6],
            },
            {
                label: "Báo cáo nhập - xuất - tồn",
                to: "/report",
                roleIds: [2, 3, 4, 6],
            },
        ],
    },
    {
        label: "Quản lý nhân sự",
        to: "/list/users",
        roleIds: [5, 6],
    },
];

export default navbar_items;
