import { Dispatch, memo, useState } from "react";
import { Button, Form, Overlay, ToggleButton } from "react-bootstrap";
import { iSlotsProp } from "../Modal/GoodsModal";

function WarehouseDiagram(props: {
    radios: iSlotsProp[];
    radioValue: string;
    setRadioValue: Dispatch<string>;
}) {
    const { radios, radioValue, setRadioValue } = props;
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState<any>();
    const [tooltip, setTooltip] = useState("");

    const handleClick = (
        radio: iSlotsProp,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setTarget(e.currentTarget);
        setTooltip(
            `
        ID kho: ${radio.good && radio.good.idWarehouse};
        ID hàng: ${radio.good && radio.good.idGoods};
        Tên hàng: ${radio.good && radio.good.name}
        `
        );
        if (target !== e.currentTarget) {
            setShow(true);
        } else {
            setShow(!show);
        }
    };

    return (
        <>
            <Form.Label className="my-2">Chú thích: &nbsp;</Form.Label>
            <Button size="sm" variant="secondary">
                Đã chứa hàng
            </Button>
            &nbsp;
            <Button size="sm" variant="outline-primary">
                Còn trống
            </Button>
            &nbsp;
            <Button size="sm" variant="primary">
                Đang chọn
            </Button>
            <br />
            <Form.Label className="my-2">
                Ví dụ <b>Tầng số 4 Kệ số 8</b>:{" "}
                <Button variant="outline-primary">4-8</Button>
            </Form.Label>
            <br />
            <Form.Label>Tầng 1</Form.Label>
            <br />
            {radios &&
                radios.map((radio, index) => {
                    if (!radio.good) {
                        const isNewFloor =
                            index === 0 ||
                            radios[index - 1].floor !== radio.floor;
                        return (
                            <>
                                {index !== 0 && isNewFloor && (
                                    <>
                                        <br />
                                        <Form.Label className="my-2">
                                            Tầng {radio.floor}
                                        </Form.Label>
                                        <br />
                                    </>
                                )}
                                <ToggleButton
                                    key={index}
                                    id={`radio-${index}`}
                                    type="radio"
                                    variant={"outline-primary"}
                                    name="radio"
                                    className="me-2 mb-2"
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                    value={`${radio.floor}-${radio.slot}`}
                                    checked={
                                        radioValue ===
                                        `${radio.floor}-${radio.slot}`
                                    }
                                    onChange={(e) => {
                                        setRadioValue(e.currentTarget.value);
                                    }}
                                >
                                    {radio.floor}-{radio.slot}
                                </ToggleButton>
                            </>
                        );
                    } else
                        return (
                            <>
                                <Button
                                    key={index}
                                    variant="secondary"
                                    className="me-2 mb-2"
                                    onClick={(e) => handleClick(radio, e)}
                                >
                                    {`${radio.floor}-${radio.slot}`}
                                </Button>
                            </>
                        );
                })}
            <Overlay target={target} show={show} placement="top">
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                }) => (
                    <div
                        {...props}
                        style={{
                            position: "absolute",
                            width: 150,
                            backgroundColor: "rgba(255, 100, 100)",
                            padding: "10px 10px",
                            marginBottom: 6,
                            color: "white",
                            borderRadius: 6,
                            zIndex: 9999,
                            ...props.style,
                        }}
                    >
                        {tooltip}
                    </div>
                )}
            </Overlay>
        </>
    );
}

export default memo(WarehouseDiagram);
