import React from "react";

/* REACT-BOOTSTRAP */
import { Card } from "react-bootstrap";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* COMPONENTS */
import Rating from "./Rating";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded-3 card-shadow-hover">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image}/>
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-name">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews}  оцен.`}
            color={"#f8e825"}
          />
        </Card.Text>

        <Card.Text as="h3">₽{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
