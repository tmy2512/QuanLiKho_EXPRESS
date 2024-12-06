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

import { createGoodsGroup, updateGoodsGroup } from "~/apis/goodsGroupAPI";
import { initGoodsGroupData } from "~/views/GoodsPropsView/GoodsPropsView";
import { iGoodsGroupProps } from "~/views/types";
import { iModalTypes } from "./types";
import stringToDate from "~/utils/stringToDate";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function GoodsGroupModal(props: {
    show: true | false;
    onHide: () => void;
    listData: iGoodsGroupProps[];
    setListData: Dispatch<SetStateAction<iGoodsGroupProps[]>>;
    modalType: iModalTypes;
    formData: iGoodsGroupProps;
    setFormData: Dispatch<React.SetStateAction<iGoodsGroupProps>>;
}) {
    const {
        show,
        onHide,
        listData,
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

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
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
                createGoodsGroup(formData)
                    .then((data) => {
                        data && setListData((prev) => [...prev, data]);
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

        updateGoodsGroup(formData).then(() => {
            listData.forEach((data, index) => {
                if (data.idGoodsGroups === formData.idGoodsGroups) {
                    //deep clone
                    const newData = [...listData];
                    newData.splice(index, 1, {
                        ...data,
                        name: formData.name,
                    });
                    setListData(newData);
                }
            });
        });
        handleCancel();
    };

    const handleCancel = () => {
        setFormData(initGoodsGroupData);
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
                <Modal.Title>{`${title} nhóm hàng`}</Modal.Title>
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
                            <FormLabel>Tên nhóm hàng</FormLabel>
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

export default memo(GoodsGroupModal);
