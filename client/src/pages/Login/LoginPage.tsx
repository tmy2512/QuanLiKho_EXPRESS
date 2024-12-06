import classNames from "classnames/bind";
import { ChangeEventHandler, FormEventHandler, useRef, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "~/apis/authAPI";
import useGlobalState from "~/hooks/useGlobalState";
import { actions } from "~/store";
import { setCookie } from "~/utils/cookies";
import roleIdGenerator from "~/utils/role";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login() {
  const [validated, setValidated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [verifyError, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const form = formRef.current;
  const navigate = useNavigate();
  const { dispatch } = useGlobalState();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, name } = e.target;
    setError("");
    setLoginData(
      (prev) =>
      (prev = {
        ...prev,
        [name]: value,
      })
    );
  };
  const handleLogin: FormEventHandler<HTMLButtonElement> = async (e) => {
    //validate input

    if (
      form?.checkValidity() === false ||
      !(loginData.username.trim() && loginData.password.trim())
    ) {
      setValidated(true);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    //call login API
    try {
      const data = await postLogin(loginData);
      if (!data) return

      //store jwt in cookie
      setCookie("jwt", data.token);
      setCookie("id", data.userId.toString());

      //dispatch set auth action to set global state
      dispatch(
        actions.setAuthentication({
          userId: data.userId,
          username: data.username,
          name: data.name,
          role: roleIdGenerator(data.idPermissions),
        })
      );

      //redirect homepage
      navigate("/");
    } catch (error) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      setLoginData({
        username: loginData.username,
        password: "",
      });
      passwordRef.current?.focus();
    }
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <Container fluid className={cx("homepage-container")}>
      <div className={cx("wrapper")}>
        <Row md="auto" className={cx("row-container")}>
          <Col md="auto" className={cx("col-container", "mx-auto")}>
            <Form
              className="p-4"
              noValidate
              validated={validated}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <h2 className="mb-4 text-center">Đăng nhập</h2>
              <Form.Group
                className="mb-3"
                controlId="formBasicEmail"
              >
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  name="username"
                  onChange={handleChange}
                  required
                  value={loginData.username}
                  minLength={1}
                />
                <Form.Control.Feedback type="invalid">
                  Bắt buộc nhập
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formBasicPassword"
              >
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  minLength={4}
                  value={loginData.password}
                  onChange={handleChange}
                  ref={passwordRef}
                />
                <Form.Text>Tối thiểu 4 ký tự</Form.Text>
                <Form.Control.Feedback type="invalid">
                  Bắt buộc nhập
                </Form.Control.Feedback>
              </Form.Group>
              <FormGroup className="mb-3">
                <Link to="#">Quên mật khẩu</Link>
              </FormGroup>
              <Button
                variant="primary"
                onClick={handleLogin}
                type="submit"
                style={{
                  width: "100%",
                }}
              >
                Đăng nhập
              </Button>
              <p className="mt-3 mb-0 text-danger text-center">
                {verifyError}
              </p>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Login;
