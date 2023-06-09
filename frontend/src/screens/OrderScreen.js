import React, { useState, useEffect } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";

/* PAYPAL BUTTONS */
// import { PayPalButton } from "react-paypal-button-v2";

/* COMPONENTS */
import Message from "../components/Message";
import Loader from "../components/Loader";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";

/* ACTION TYPES */
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import ModalPayment from "../components/ModalPayment";

function OrderScreen({ history, match }) {
  // const orderId = match.params.id;
  //
  // const dispatch = useDispatch();
  //
  // const [sdkReady, setSdkReady] = useState(false);
  //
  // /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  // const orderDetails = useSelector((state) => state.orderDetails);
  // const { order, error, loading } = orderDetails;
  //
  // const orderPay = useSelector((state) => state.orderPay);
  // const { loading: loadingPay, success: successPay } = orderPay;
  //
  // const orderDeliver = useSelector((state) => state.orderDeliver);
  // const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  //
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  //
  // // ITEMS PRICE GETS CALCULATED ONLY IF WE HAVE AN ORDER
  // if (!loading && !error) {
  //   order.itemsPrice = order.orderItems
  //     .reduce((acc, item) => acc + item.price * item.qty, 0)
  //     .toFixed(2);
  // }
  //
  // // // PAYPAL BUTTONS
  // // const addPayPalScript = () => {
  // //   const script = document.createElement("script");
  // //   script.type = "text/javascript";
  // //   script.src =
  // //     "https://www.paypal.com/sdk/js?client-id=AYgflmsaM7ccNLPlKUiufIyw8-spOE4UuS5XyyTCvhzheA-1EUcZF9qGlgXBZaSKcP5BY0zTc9WgINKe";
  // //   script.async = true;
  // //   script.onload = () => {
  // //     setSdkReady(true);
  // //   };
  // //   document.body.appendChild(script);
  // // };
  //
  // useEffect(() => {
  //   // IS USER IS NOT LOGGED IN THEN REDIRECT TO LOGIN PAGE
  //   if (!userInfo) {
  //     history.push("/login");
  //   }
  //
  //   // CHECK IF WE HAVE THE ORDER DETAILS, IF NOT DISPATCH AN ACTION TO GET THE ORDER DETAILS
  //   if (
  //     !order ||
  //     successPay ||
  //     order._id !== Number(orderId) ||
  //     successDeliver
  //   ) {
  //     dispatch({ type: ORDER_PAY_RESET });
  //
  //     dispatch({ type: ORDER_DELIVER_RESET });
  //
  //     dispatch(getOrderDetails(orderId));
  //   } else if (!order.isPaid) {
  //     // // ACTIVATING PAYPAL SCRIPTS
  //     // if (!window.paypal) {
  //     //   addPayPalScript();
  //     // } else {
  //     //   setSdkReady(true);
  //     // }
  //   }
  // }, [dispatch, order, orderId, successPay, successDeliver, history, userInfo]);
  //
  // /* HANDLERS */
  // const successPaymentHandler = (paymentResult) => {
  //   dispatch(payOrder(orderId, true));
  // };
  //
  // const deliverHandler = () => {
  //   dispatch(deliverOrder(order));
  // };

  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (
        !order ||
        order._id !== Number(orderId) ||
        successDeliver
    ) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successDeliver, history, userInfo]);

  const handlePaymentModalOpen = () => {
    setShowModal(true);
  };

  const handlePaymentModalClose = () => {
    setShowModal(false);
  };

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, true));
    setShowModal(false);

    window.location.reload(); // Обновление страницы
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };


  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Заказ: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Доставка</h2>

              <p>
                <strong>Имя: {order.User.name}</strong>
              </p>

              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.User.email}`}>{order.User.email}</a>
              </p>

              <p>
                <strong>Адрес доставки: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDeliver ? (
                <Message variant="success">
                  Delivered on{" "}
                  {order.deliveredAt
                    ? order.deliveredAt.substring(0, 10)
                    : null}
                </Message>
              ) : (
                <Message variant="warning">Еще не доставлен</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Оплата</h2>

              <p>
                <strong>Метод оплаты: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">
                  Заказ оплачен: {order.paidAt ? order.paidAt.substring(0, 10) : null}
                </Message>
              ) : (
                <Message variant="warning">Оплатите заказ</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Товары к заказу</h2>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Заказ пуст</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ₽{item.price} = ₽
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Информация о заказе</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Товары:</Col>

                  <Col>₽{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Доставка:</Col>

                  <Col>₽{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>НДС:</Col>

                  <Col>₽{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Итого:</Col>

                  <Col>₽{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  <Button onClick={handlePaymentModalOpen}>Оплатить</Button>
                </ListGroup.Item>
              )}
            </ListGroup>

            {loadingDeliver && <Loader />}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDeliver && (
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn w-100"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>


      <ModalPayment
          show={showModal}
          handleClose={handlePaymentModalClose}
          successPaymentHandler={successPaymentHandler}
          orderId={orderId}
          order={order}
          userInfo={userInfo}
      />
    </div>
  );
}

export default OrderScreen;
