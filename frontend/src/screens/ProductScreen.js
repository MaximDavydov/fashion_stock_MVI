import React, { useEffect, useState } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";

/* COMPONENTS */
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import {
  listProductDetails,
  createProductReview, getProductDetails, increaseBidAmount,
} from "../actions/productActions";

/* ACTION TYPES */
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import axios from "axios";



function ProductScreen({ match, history }) {

  const [bidAmount, setBidAmount] = useState(1500);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAuction, setAuction] = useState(false);
  const [disableAddToCart, setDisableAddToCart] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [disableCountdown, setDisableCountdown] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const increasePrice = async (bidAmount) => {
    try {
      const product_id = match.params.id;

      dispatch(increaseBidAmount(product_id, bidAmount));

      const productCreationTime = new Date(product.createdAt);

      const twoMinutesAgo = Date.now() - 0.2 * 60 * 1000;

      if (productCreationTime.getTime() > twoMinutesAgo) {
        setAuction(true);
      }

      setDisableAddToCart(true);
      setDisableCountdown(true);
      setCountdown(20);

      // Dispatch the getProductDetails action to update the product details
      dispatch(getProductDetails(product_id));

      // Start the countdown
      startCountdown();
    } catch (error) {
      console.error("Ошибка при повышении стоимости продукта:", error);
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setDisableAddToCart(false);
      setDisableCountdown(false);
      addToCartHandler(); // Call addToCartHandler after the timer ends
    }, 20000);
  };

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match]);


  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProdcutReview,
  } = productReviewCreate;

  /* FIRING OFF THE ACTION CREATORS USING DISPATCH */

  useEffect(() => {
    // IF REVIEW SUCCESSFULLY SUBMITTED, RESET
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  /* HANDLERS */
  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(createProductReview(match.params.id, { rating, comment }));
  };



  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        На главную
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={4}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={5}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} оцен.`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Цена: {product.price}₽</ListGroup.Item>

                <ListGroup.Item>
                  Описание: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Цена:</Col>
                      <Col>
                        <strong>{product.price} ₽</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Наличие:</Col>
                      <Col>
                        {product.countInStock > 0 ? "Есть в наличии" : "Нет в наличии"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Кол-во</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}


                  <ListGroup.Item>
                    <Row>
                      <Col>Ставка:</Col>
                      <Col>
                        <input
                            type="number"
                            min="0"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            disabled={product.countInStock <= 0 || isAuction || disableAddToCart}
                            placeholder="Введите сумму ставки"
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                        className="w-100"
                        disabled={product.countInStock <= 0 || isAuction || disableAddToCart || bidAmount < 1000}
                        type="button"
                        onClick={() => increasePrice(bidAmount)}
                    >
                      Поднять ставку ({bidAmount || 0}₽)
                    </Button>
                  </ListGroup.Item>

                  {disableCountdown && (
                      <ListGroup.Item>
                        <p>Ожидание ставок: {countdown} секунд</p>
                      </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <h4>Аукцион</h4>
                    <p>
                      Этот товар доступен на аукционе. Вы можете увеличить ставку на товар, указав сумму в поле "Ставка".
                      Ставка должна быть не менее 1000₽ и не ниже текущей ставки.
                      После каждого увеличения ставки начинается обратный отсчет времени в течение 20 секунд.
                      Если ни одна ставка не будет сделана в течение указанного времени, товар добавится в корзину автоматически.
                    </p>
                  </ListGroup.Item>

                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h4 className="mt-3">Отзывы</h4>

              {product.reviews.length === 0 && (
                <Message variant="info">Нет отзывов</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>

                    <Rating value={review.rating} color="f8e825" />

                    <p>{review.createdAt.substring(0, 10)}</p>

                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Оставить отзыв</h4>

                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">Отзыв добавлен!</Message>
                  )}
                  {errorProdcutReview && (
                    <Message variant="danger">{errorProdcutReview}</Message>
                  )}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Рейтинг</Form.Label>

                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Выбрать...</option>
                          <option value="1">1 - Ужас</option>
                          <option value="2">2 - Недостойно тела</option>
                          <option value="3">3 - Ну, бывает и хуже...</option>
                          <option value="4">4 - Нормально</option>
                          <option value="5">5 - Великолепно</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Отзыв</Form.Label>

                        <Form.Control
                          as="textarea"
                          row="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                        className="my-3"
                      >
                        Отправить
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Пожалуйста <Link to="/login">Авторизируйтесь</Link> чтобы оставить отзыв.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
