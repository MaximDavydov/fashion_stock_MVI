import React, { useState} from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const ModalPayment = ({
                          show,
                          handleClose,
                          successPaymentHandler,
                          orderId,
                          userInfo
                      }) => {
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cardHolderFirstName, setCardHolderFirstName] = useState(userInfo.name);
    const [error, setError] = useState("");

    const handlePayment = (e) => {
        e.preventDefault();

        if (
            cardNumber.trim() === "" ||
            expirationDate.trim() === "" ||
            cardHolderFirstName.trim() === ""
        ) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        successPaymentHandler(orderId);


    };

    const onClose = () => {
        setCardNumber("");
        setExpirationDate("");
        setCardHolderFirstName("");
        setError("");
        handleClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Оплата</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handlePayment}>
                    <Form.Group>
                        <Form.Label>Номер карты</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Номер карты"
                            value={cardNumber}
                            onChange={(e) => {
                                const formattedCardNumber = e.target.value.replace(/[^\d]/g, "")
                                    .replace(/(.{4})/g, "$1-")
                                    .trim()
                                    .slice(0, 19);
                                setCardNumber(formattedCardNumber);
                            }}
                            required
                            pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Срок действия</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Срок действия"
                            value={expirationDate}
                            onChange={(e) => {
                                const formattedExpirationDate = e.target.value.replace(/[^\d]/g, "")
                                    .replace(/(.{2})/g, "$1/")
                                    .trim()
                                    .slice(0, 5);
                                setExpirationDate(formattedExpirationDate);
                            }}
                            required
                            pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Имя пользователя"
                            value={cardHolderFirstName}
                            onChange={(e) => setCardHolderFirstName(e.target.value)}
                            required
                            pattern="[A-Za-zА-Яа-яЁё]+"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={handlePayment}>
                        Оплатить
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPayment;