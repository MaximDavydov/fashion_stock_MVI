import React, { useState, useEffect } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import { Row, Col, Button, Form } from "react-bootstrap";

/* COMPONENTS */
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { register } from "../actions/userActions";

function RegisterScreen({ location, history }) {
  /* STATE */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  /* SETTING UP REDIRECT */
  const redirect = location.search ? location.search.split("=")[1] : "/";

  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  const userRegister = useSelector((state) => state.userRegister);

  const { userInfo, loading, error } = userRegister;

  /* REDIRECTING AN ALREADY LOGGED IN USER, AS WE DON'T WANT THEM TO SEE THE LOGIN PAGE */
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  /* HANDLERS */

  const submitHandler = (e) => {
    e.preventDefault();

    /* DISABLE SUBMIT IF PASSWORDS DON'T MATCH */
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      /* FIRING OFF THE ACTION CREATORS USING DISPATCH FOR REGISTER */
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Регистрация</h1>

      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            required
            type="name"
            placeholder="Укажите Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Укажите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Придумайте пароль"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="passwordConfirm">
          <Form.Label>Подтверите пароль</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Введите пароль еще раз"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Регистрация
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Уже есть аккаунт ?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Авторизируйтесь
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
