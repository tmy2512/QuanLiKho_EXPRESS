import {
    ChangeEventHandler,
    Dispatch,
    FormEventHandler,
    SetStateAction,
    memo,
    useCallback,
    useRef,
    useState,
} from "react";
import { Alert, Button, Form, FormLabel, Modal, Row } from "react-bootstrap";

import { createGoodsType, updateGoodsType } from "~/apis/goodsTypeAPI";
import stringToDate from "~/utils/stringToDate";
import { initGoodsTypeData } from "~/views/GoodsPropsView/GoodsPropsView";
import { iGoodsGroupProps, iGoodsTypeProps } from "~/views/types";
import { iModalTypes } from "./types";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function GoodsTypeModal(props: {
    show: true | false;
    onHide: () => void;
    groupListData: iGoodsGroupProps[];
    typeListData: iGoodsTypeProps[];
    setListData: Dispatch<SetStateAction<iGoodsTypeProps[]>>;
    modalType: iModalTypes;
    formData: iGoodsTypeProps;
    setFormData: Dispatch<React.SetStateAction<iGoodsTypeProps>>;
}) {
    const {
        show,
        onHide,
        typeListData,
        groupListData,
        setListData,
        modalType,
        formData,
        setFormData,
    } = props;
    const [validated, setValidated] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    let title: string;
    const role = useRole();

    switch (modalType.type) {
        case "create":
            title = "Thêm mới";
            break;
        case "update":
            title = "Xem / Chỉnh sửa thông tin";
            break;
    }

    const handleChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > = (e) => {
        const { value, name } = e.target;

        setFormData(
            (prev) =>
                (prev = {
                    ...prev,
                    [name]: value,
                })
        );
    };

    const validateForm = () => {
        const form = formRef.current;

        //trim()
        formData.name = formData.name.trim();

        if (form && form.checkValidity() === false) {
            setValidated(true);
            return false;
        }

        return true;
    };

    const handleSubmitCreate: FormEventHandler<HTMLButtonElement> = useCallback(
        (e) => {
            const isValidated = validateForm();
            e.preventDefault();
            e.stopPropagation();

            //call API
            isValidated &&
                createGoodsType(formData)
                    .then((data) => {
                        data &&
                            setListData((prev) => [
                                ...prev,
                                {
                                    ...data,
                                },
                            ]);
                        !data.error && handleCancel();
                    })
                    .catch((error) => console.log(error));
        },
        [formData, setListData]
    );

    const handleSubmitUpdate: FormEventHandler<HTMLButtonElement> = (e) => {
        const isValidated = validateForm();
        e.preventDefault();
        e.stopPropagation();
        if (!isValidated) return;

        updateGoodsType(formData).then(() => {
            typeListData.forEach((data, index) => {
                if (data.idGoodsTypes === formData.idGoodsTypes) {
                    //deep clone
                    const newData = [...typeListData];
                    let idGroup2;
                    groupListData.forEach((group) => {
                        if (group.idGoodsGroups === +formData.idGoodsGroup) {
                            idGroup2 = group;
                        }
                    });

                    newData.splice(index, 1, {
                        ...data,
                        idGoodsGroup2: idGroup2,
                        name: formData.name,
                    });
                    setListData(newData);
                }
            });
        });
        handleCancel();
    };

    const handleCancel = () => {
        setFormData(initGoodsTypeData);
        setValidated(false);
        onHide();
    };

    return (
        <Modal
            backdrop={modalType.type === "create" ? "static" : undefined}
            show={show}
            onHide={onHide}
            keyboard={false}
            fullscreen="sm-down"
        >
            <Modal.Header>
                <Modal.Title>{`${title} loại hàng`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={validated}
                    ref={formRef}
                    autoComplete="off"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Row className="mb-3">
                        <Form.Group controlId="formGridName">
                            <FormLabel>Tên loại hàng</FormLabel>
                            <Form.Control
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc nhập
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group controlId="formGridGroup">
                            <Form.Label>Nhóm hàng</Form.Label>
                            <Form.Select
                                required
                                onChange={handleChange}
                                name="idGoodsGroup"
                                value={formData.idGoodsGroup}
                            >
                                <option value="">
                                    ------Chọn nhóm hàng------
                                </option>
                                {groupListData.length &&
                                    groupListData.map((group) => (
                                        <option
                                            key={group.idGoodsGroups}
                                            value={group.idGoodsGroups}
                                        >
                                            {group.name}
                                        </option>
                                    ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc chọn
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Check
                            required
                            label="Đã kiểm tra kỹ thông tin"
                            feedback="Vui lòng đánh dấu checkbox này để gửi thông tin!"
                            feedbackType="invalid"
                        />
                    </Form.Group>
                    <Alert variant="info">
                        Vui lòng kiểm tra kỹ thông tin!
                    </Alert>
                    {modalType.type === "update" && formData.deletedAt && (
                        <>
                            <Form.Text>
                                {`Đã bị vô hiệu hoá lúc ${stringToDate(
                                    formData.deletedAt?.toString()
                                )}`}
                            </Form.Text>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" type="reset" onClick={handleCancel}>
                    {modalType.type === "update" ? "Đóng" : "Huỷ"}
                </Button>
                {(role === ROLE_ID.ASSURANCE_3 || role === ROLE_ID.CEO_6) &&
                    (modalType.type === "create" ? (
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmitCreate}
                        >
                            Thêm mới
                        </Button>
                    ) : (
                        <Button
                            variant="warning"
                            type="submit"
                            onClick={handleSubmitUpdate}
                        >
                            Cập nhật chỉnh sửa
                        </Button>
                    ))}
            </Modal.Footer>
        </Modal>
    );
}

export default memo(GoodsTypeModal);
