import React, {useEffect, useState} from "react";

/* REACT BOOTSTRAP */
import { Button, Form, Col } from "react-bootstrap";

/* COMPONENTS */
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen({ history }) {
  // PULLING OUT SHIPPING ADDRESS FROM CART
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  // STATE
  const [paymentMethod, setPaymentMethod] = useState("");

  /* IF NO SHIPPING ADDRESS THEN REDIRECT TO ShippingAddress SCREEN */
  if (!shippingAddress.address) {
    history.push("./shipping");
  }

  // HANDLERS

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    // AFTER CHOSING THE PAYMENT METHOD REDIRECT USER TO PlaceOrder SCREEN
    history.push("/placeorder");
  };

  useEffect(() => {
    console.log(paymentMethod)
  },[paymentMethod])

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Выберите метод оплаты</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="Оплата картой (МИР)"
              id="mir"
              name="paymentMethod"
              onChange={() => setPaymentMethod('MIR')}
            ></Form.Check>
            <Form.Check
                type="radio"
                label="Оплата картой (VISA/MASTERCARD)"
                id="visa"
                name="paymentMethod"
                onChange={() => setPaymentMethod('VISA')}
            ></Form.Check>
            <Form.Check
                type="radio"
                label="Рассрочка"
                id="credit"
                name="paymentMethod"
                disabled
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3" disabled={!paymentMethod}>
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;

