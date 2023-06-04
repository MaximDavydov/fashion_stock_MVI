import React from "react";

/* REACT-BOOTSTRAP */
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Сделано с любовью к РЭУ Ильей, Максимом и Валерием</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
