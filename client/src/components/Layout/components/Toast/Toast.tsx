import { useState } from "react";
import { ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import { Variant } from "react-bootstrap/esm/types";

interface iToastProps {
    title: string;
    message?: string;
    variant?: Variant;
}

function ToastNotification(props: iToastProps) {
    const { title, message, variant } = props;
    const [show, setShow] = useState(true);

    return (
        <>
            <ToastContainer position="bottom-start">
                <Toast
                    className="d-inline-block m-1"
                    bg={variant}
                    delay={3000}
                    autohide
                    animation
                    onClose={() => setShow(false)}
                    show={show}
                >
                    <Toast.Header>
                        <i className="fa-solid fa-check"></i>
                        &nbsp;
                        <strong className="me-auto">{title}</strong>
                    </Toast.Header>
                    <Toast.Body>{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export type { iToastProps };
export default ToastNotification;
