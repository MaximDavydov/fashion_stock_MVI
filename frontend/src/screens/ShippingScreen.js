import React, { useState } from "react";

/* REACT BOOTSTRAP */
import { Button, Form } from "react-bootstrap";

/* COMPONENTS */
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen({ history }) {
  // PULLING OUT SHIPPING ADDRESS FROM CART
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  // STATE
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  // HANDLERS
  const submitHandler = (e) => {
    e.preventDefault();

    /* FIRING OFF THE ACTION CREATORS USING DISPATCH TO SAVE ADDRESS */
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );

    // PUSHING USER TO PAYMENTS PAGE AFTER SAVING ADDRESS
    history.push("./payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <h1>Доставка</h1>
      <Form onSubmit={submitHandler}>

          <Form.Group controlId="country">
              <Form.Label>Страна</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Укажите страну доставки"
                  value={country ? country : "Россия"}
                  onChange={(e) => setCountry(e.target.value)}
              />
          </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>Город</Form.Label>
          <Form.Control
              required
              type="text"
              placeholder="Город доставки"
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Адрес доставки</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Адрес доставки"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Почтовый индекс</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Укажите Ваш почтовый индекс"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <Button className="my-3" type="submit" variant="primary">
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
