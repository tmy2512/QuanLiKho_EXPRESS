import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { getAllExportReceiptByStatus } from "~/apis/exportReceiptAPI";
import {
    iModalTypes,
    iPrintExportReceipt,
} from "~/components/Layout/components/Modal/types";

import {
    getDistricts,
    getProvinces,
    getWards,
    iDistrictProps,
    iProvinceProps,
    iWardProps,
} from "~/apis/provinceAPI";
import ProcessorModal from "~/components/Layout/components/Modal/ProcessorModal";
import ProcessorTable from "~/components/Layout/components/Table/ProcessorTable/ProcessorTable";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import { initExportReceipt } from "../ExportReceiptView/ExportReceiptView";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

const initProcessingData: iPrintExportReceipt = {
    idExportReceipts: 0,
    idExportOrder: 0,
};

interface iTabProps {
    eventKey: string;
    title: ReactNode;
}

function ProcessorView() {
    //SHARED PROPS
    const [key, setKey] = useState("packed");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
    const [listData, setListData] = useState<iExportReceiptItemProps[]>([]);
    const [filterList, setFilterList] = useState<iExportReceiptItemProps[]>([]);
    const [formData, setFormData] =
        useState<iExportReceiptProps>(initExportReceipt);
    const [provinces, setProvinces] = useState<iProvinceProps[]>([]);
    const [districts, setDistricts] = useState<iDistrictProps[]>([]);
    const [wards, setWards] = useState<iWardProps[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedWard, setSelectedWard] = useState<string>("");
    const [isHeavy, setIsHeavy] = useState<boolean>(false);
    const role = useRole();

    useEffect(() => {
        const fetchData = async () => {
            const provincesData = await getProvinces();
            provincesData && setProvinces(provincesData);
        };

        fetchData();
    }, []);

    const handleProvinceChange = async (provinceId: string) => {
        // Lọc danh sách đơn hàng theo xã được chọn
        const filteredOrders = listData.filter(
            (order) => order?.idExportOrder2.provinceCode === provinceId
        );

        // Cập nhật state hiển thị danh sách đơn hàng
        setFilterList(provinceId === "" ? listData : filteredOrders);
        setSelectedProvince(provinceId);
        const districtsData = await getDistricts(provinceId);
        districtsData && setDistricts(districtsData);
    };

    const handleDistrictChange = async (districtId: string) => {
        // Lọc danh sách đơn hàng theo xã được chọn
        const filteredOrders = listData.filter(
            (order) => order?.idExportOrder2.districtCode === districtId
        );

        // Cập nhật state hiển thị danh sách đơn hàng
        setFilterList(filteredOrders);
        setSelectedDistrict(districtId);
        const wardsData = await getWards(districtId);
        wardsData && setWards(wardsData);
    };
    const handleWardChange = (wardId: string) => {
        // Lọc danh sách đơn hàng theo xã được chọn
        const filteredOrders = listData.filter(
            (order) => order?.idExportOrder2.wardCode === wardId
        );

        // Cập nhật state hiển thị danh sách đơn hàng
        setFilterList(filteredOrders);
        setSelectedWard(wardId);
    };

    const process = key === "packed" ? " đóng gói " : " phân loại ";
    const tabs: iTabProps[] = [
        {
            eventKey: "packed",
            title: (
                <>
                    <i className="fa-solid fa-box"></i>
                    <br />
                    Đã đóng gói
                </>
            ),
        },
        {
            eventKey: "classified",
            title: (
                <>
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <br />
                    Đã phân loại
                </>
            ),
        },
    ];

    //HANDLER
    const handleSelected = useCallback(() => {
        let statusCode: number = 0;
        switch (key) {
            case "packed":
                statusCode = 1; //STATUS.PACKED
                break;
            case "classified":
                statusCode = 2; //STATUS.CLASSIFIED
                break;
        }
        getAllExportReceiptByStatus(statusCode).then((data) => {
            if (!data) return;
            let filteredData: iExportReceiptItemProps[] = [];
            if (isHeavy) {
                for (const receipt of data) {
                    const isHeavyReceipts =
                        receipt.idExportOrder2.exportOrderDetails.every(
                            (detail) => detail.idGoods2?.isHeavy === true
                        );
                    if (isHeavyReceipts) filteredData.push(receipt);
                }
            } else filteredData = [...data];
            setListData(filteredData);
            setFilterList(filteredData);
        });
    }, [key, isHeavy]);

    useEffect(() => {
        handleSelected();
    }, [handleSelected]);

    const handleToggleShowModal = () => {
        setShowModal(!showModal);
        setModalType({ type: "create" });
    };

    return (
        <>
            <h2>Danh sách hàng đang được xử lý</h2>
            <Tabs
                defaultActiveKey="packed"
                activeKey={key}
                id="fill-tabs"
                className="my-3"
                variant="pills"
                fill
                justify
                style={{
                    fontWeight: "bold",
                }}
                onSelect={(key) => {
                    key && setKey(key);
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.eventKey}
                        eventKey={tab.eventKey}
                        title={tab.title}
                    >
                        {key === tab.eventKey && (
                            <>
                                <hr />
                                {(role === ROLE_ID.OPERATION_1 ||
                                    role === ROLE_ID.CEO_6) && (
                                    <Button
                                        onClick={handleToggleShowModal}
                                        className="mb-3"
                                        variant="outline-primary"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <i className="fa-solid fa-expand"></i>
                                        &nbsp; Xác nhận {process}
                                    </Button>
                                )}

                                <ProcessorModal
                                    show={showModal}
                                    onHide={handleToggleShowModal}
                                    listData={listData}
                                    setListData={
                                        key === "classified"
                                            ? setFilterList
                                            : setListData
                                    }
                                    modalType={modalType}
                                    formData={formData}
                                    setFormData={setFormData}
                                    tabKey={key}
                                />

                                {key === "classified" && (
                                    <Row className="mb-3">
                                        <Col sm>
                                            <Form.Select
                                                value={selectedProvince}
                                                onChange={(e) =>
                                                    handleProvinceChange(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    ----Phân loại theo tỉnh /
                                                    thành phố----
                                                </option>
                                                {provinces.map((province) => (
                                                    <option
                                                        key={
                                                            province.province_id
                                                        }
                                                        value={
                                                            province.province_id
                                                        }
                                                    >
                                                        ID:{" "}
                                                        {province.province_id} -{" "}
                                                        {province.province_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>

                                        {selectedProvince && (
                                            <Col sm>
                                                <Form.Select
                                                    value={selectedDistrict}
                                                    onChange={(e) =>
                                                        handleDistrictChange(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        ----Phân loại theo quận
                                                        / huyện----
                                                    </option>
                                                    {districts.map(
                                                        (district) => (
                                                            <option
                                                                key={
                                                                    district.district_id
                                                                }
                                                                value={
                                                                    district.district_id
                                                                }
                                                            >
                                                                ID:{" "}
                                                                {
                                                                    district.district_id
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    district.district_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                            </Col>
                                        )}

                                        {selectedDistrict && (
                                            <Col sm>
                                                <Form.Select
                                                    value={selectedWard}
                                                    onChange={(e) =>
                                                        handleWardChange(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        ----Phân loại theo xã /
                                                        phường / thị trấn----
                                                    </option>
                                                    {wards.map((ward) => (
                                                        <option
                                                            key={ward.ward_id}
                                                            value={ward.ward_id}
                                                        >
                                                            ID: {ward.ward_id} -{" "}
                                                            {ward.ward_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        )}
                                    </Row>
                                )}

                                <Row>
                                    <Col className="d-flex">
                                        <Form.Label
                                            htmlFor="isHeavy"
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            Phân loại theo hàng cồng
                                            kềnh&nbsp;&nbsp;
                                        </Form.Label>
                                        &nbsp;&nbsp;
                                        <Form.Check
                                            required
                                            type="switch"
                                            id="isHeavy"
                                            title="Lọc ra các đơn hàng cồng kềnh"
                                            name="isHeavy"
                                            checked={isHeavy}
                                            onChange={() =>
                                                setIsHeavy(!isHeavy)
                                            }
                                        ></Form.Check>
                                    </Col>
                                </Row>

                                <ProcessorTable
                                    tabKey={key}
                                    listData={
                                        key === "classified"
                                            ? filterList
                                            : listData
                                    }
                                    toggleShowModal={handleToggleShowModal}
                                    setModalType={setModalType}
                                    setFormData={setFormData}
                                />
                            </>
                        )}
                    </Tab>
                ))}
            </Tabs>
        </>
    );
}

export { initProcessingData };
export default ProcessorView;
