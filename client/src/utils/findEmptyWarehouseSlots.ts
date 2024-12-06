import {
    iSlotsProp,
    iWarehouseSlots,
} from "~/components/Layout/components/Modal/GoodsModal";

function findEmptyWarehouseSlots(data: iWarehouseSlots) {
    const { warehouse, goodsSlots } = data;
    const emptySlots: iSlotsProp[] = [];

    // Lặp qua các tầng
    for (let floor = 1; floor <= warehouse.totalFloors; floor++) {
        // Lặp qua các kệ trong mỗi tầng
        for (let slot = 1; slot <= warehouse.totalSlotsPerFloor; slot++) {
            // Kiểm tra trạng thái kệ
            goodsSlots.forEach((good) => {
                if (good.floor === floor && good.slot === slot) {
                    emptySlots.push({ floor, slot, good });
                }
            });
            const isOccupied = goodsSlots.some(
                (good) => good.floor === floor && good.slot === slot
            );
            if (!isOccupied) emptySlots.push({ floor, slot });
        }
    }

    return emptySlots;
}

export default findEmptyWarehouseSlots;
