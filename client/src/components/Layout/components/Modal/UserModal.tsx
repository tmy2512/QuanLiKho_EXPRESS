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
import {
    Alert,
    Button,
    Col,
    Form,
    FormLabel,
    Modal,
    Row,
} from "react-bootstrap";

import { createUser, updateUser } from "~/apis/userAPI";
import ROLES, { iRole } from "~/constants/roles";
import { iUserDataProps, iUserItemProps } from "~/views/types";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import { initialUserDataState } from "~/views/UserView/UserView";
import { iModalTypes } from "./types";

function UserModal(props: {
    show: true | false;
    onHide: () => void;
    listData: iUserItemProps[];
    setListData: Dispatch<SetStateAction<iUserItemProps[]>>;
    modalType: iModalTypes;
    formData: iUserDataProps;
    setFormData: Dispatch<React.SetStateAction<iUserDataProps>>;
    role: number;
    setRole: Dispatch<React.SetStateAction<number>>;
}) {
    const {
        show,
        onHide,
        listData,
        setListData,
        modalType,
        formData,
        setFormData,
        role,
        setRole,
    } = props;
    const [validated, setValidated] = useState(false);
    const startDateRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    let title: string;

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
    const handleSelectedChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const { value, name } = e.target;
        switch (name) {
            case "gender":
                if (value === "M" || value === "F" || value === "O") {
                    setFormData(
                        (prev) =>
                            (prev = {
                                ...prev,
                                [name]: value,
                            })
                    );
                }
                break;
            case "id_permissions": {
                const originalRoles: iRole[] = JSON.parse(
                    JSON.stringify(ROLES)
                );
                const currentRole = originalRoles.filter(
                    (role) => role.id === +value
                )[0];
                const idPermissions = currentRole?.idPermissions || [];
                const roleId = currentRole?.id || 0;

                setFormData(
                    (prev) =>
                        (prev = {
                            ...prev,
                            idPermissions,
                        })
                );
                setRole(roleId);
            }
        }
    };

    const customValidateDate = () => {
        const dateInput = startDateRef.current;

        //validate startDate <= now
        if (dateInput && dateInput.value.length > 0) {
            const date = new Date(dateInput.value);
            const now = new Date(Date.now());

            if (date > now) {
                dateInput.setCustomValidity(
                    "Ngày bắt đầu làm không thể trong tương lai"
                );
                dateInput.reportValidity();
                return false;
            } else {
                dateInput.setCustomValidity("");
                dateInput.reportValidity();
            }
        }

        return true;
    };

    const validateForm = () => {
        const form = formRef.current;

        //trim()
        formData.name = formData.name.trim();
        formData.email = formData.email.trim();
        formData.phone = formData.phone.trim();
        formData.username = formData.username.trim();
        if (modalType.type === "create" && formData.password)
            formData.password = formData.password.trim();
        if (
            (form && form.checkValidity() === false) ||
            customValidateDate() === false
        ) {
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
                createUser(formData)
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
        const managerId = +getCookie("id");

        setFormData(
            (prev) =>
                (prev = {
                    ...prev,
                    idUpdated: managerId,
                })
        );

        updateUser(formData).then(() => {
            listData.forEach((data, index) => {
                if (data.idUsers === formData.idUsers) {
                    //deep clone
                    const newData = [...listData];
                    newData.splice(index, 1, {
                        ...data,
                        name: formData.name,
                        username: formData.username,
                        disabled: formData.disabled,
                    });
                    setListData(newData);
                }
            });
        });
        handleCancel();
    };

    const handleCancel = () => {
        setFormData(initialUserDataState);
        setValidated(false);
        setRole(0);
        onHide();
    };

    return (
        <Modal
            backdrop={modalType.type === "create" ? "static" : undefined}
            show={show}
            onHide={onHide}
            keyboard={false}
            fullscreen={"sm-down"}
        >
            <Modal.Header>
                <Modal.Title>{`${title} nhân viên`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={validated}
                    ref={formRef}
                    autoComplete="off"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Row>
                        <Form.Group as={Col}>
                            <FormLabel>Họ và tên</FormLabel>
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
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc nhập
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridGender">
                            <Form.Label>Giới tính</Form.Label>
                            <Form.Select
                                required
                                name="gender"
                                value={formData.gender}
                                onChange={handleSelectedChange}
                            >
                                <option value="">
                                    ------Chọn giới tính------
                                </option>
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="O">Khác</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc chọn
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPhone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="tel"
                                pattern="[0]{1}[0-9]{9}"
                                required
                                minLength={10}
                                maxLength={10}
                                aria-describedby="PhoneHelpBlock"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <Form.Text id="PhoneHelpBlock" muted>
                                Bắt đầu từ 0 và có 10 số
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc nhập
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridStartDate">
                            <Form.Label>Ngày vào làm</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                ref={startDateRef}
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                onBlur={() => customValidateDate()}
                            />
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc nhập
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridUsername">
                        <Form.Label>Tên đăng nhập</Form.Label>
                        <Form.Control
                            required
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Bắt buộc nhập
                        </Form.Control.Feedback>
                    </Form.Group>

                    {modalType.type === "create" && (
                        <Form.Group
                            className="mb-3"
                            controlId="formGridPassword"
                        >
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                minLength={4}
                                aria-describedby="PasswordHelpBlock"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Form.Text id="PasswordHelpBlock" muted>
                                Tối thiểu 4 ký tự
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Bắt buộc nhập
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3" controlId="formGridRole">
                        <Form.Label>Phòng ban</Form.Label>
                        <Form.Select
                            required
                            onChange={handleSelectedChange}
                            name="id_permissions"
                            value={role}
                        >
                            <option value={0}>
                                ------Chọn phòng ban------
                            </option>
                            {ROLES.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Bắt buộc chọn
                        </Form.Control.Feedback>
                    </Form.Group>
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
                    {modalType.type === "update" && (
                        <>
                            <Form.Text>
                                {`Tạo lúc ${
                                    formData.createdAt &&
                                    stringToDate(formData.createdAt?.toString())
                                } bởi ${formData.usernameCreated}`}
                            </Form.Text>
                            {formData.usernameUpdated && (
                                <>
                                    <br />
                                    <Form.Text>
                                        {`Sửa đổi lần cuối lúc ${
                                            formData.updatedAt &&
                                            stringToDate(
                                                formData.updatedAt?.toString()
                                            )
                                        } bởi ${formData.usernameUpdated}`}
                                    </Form.Text>
                                </>
                            )}
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" type="reset" onClick={handleCancel}>
                    {modalType.type === "update" ? "Đóng" : "Huỷ"}
                </Button>
                {modalType.type === "create" ? (
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
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default memo(UserModal);
