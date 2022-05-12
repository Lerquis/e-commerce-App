// ?El hecho que el archivo se llame [nombre] significa que va a ser
// ?un archivo dinamico

import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { Product } from "../../components";
import { client, urlFor } from "../../lib/client";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;

  const [index, setIndex] = useState(0);

  const { decQty, incQty, qty, onAddCart, setQty, setShowCart } =
    useStateContext();

  const handleBuyNow = () => {
    onAddCart(product, qty);
    setShowCart(true);
  };
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && (image[index] || image[0]))}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => {
                  setIndex(i);
                }}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">₡{price}</p>
          <div className="quantity">
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" onClick={() => {}}>
                {qty}
              </span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                onAddCart(product, qty);
                setQty(1);
              }}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may like...</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product product={item} key={item._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ?para que funcione el getStaticProps, nextJs tiene que saber
// ?cuales son todas las posibles rutas, entonces lo que hacemos
// ?en este caso es dar todos los slugs que tenemos en la base de
// ?datos ya que con eso se entra al productDetails, por el slug
// ?entonces devolvemos un objeto con el slug de cada producto
// ?ya que son las posibles rutas a las que el usuario puede entrar
export const getStaticPaths = async () => {
  const query = `*[_type=="product"]{
        slug{
            current
        }
    }`;
  const products = await client.fetch(query);
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

// ?Esto sirve para cargar las paginas mas eficiente. Ahora en params
// ?estamos destructurando el slug, eso porque el archivo se llama slug
// ?y el slug es lo que se encuentra en la ip
// ?Es decir, slug === pagina.com/product/SLUG y asi sabremos que producto
// ?estamos buscando

export const getStaticProps = async ({ params: { slug } }) => {
  // ?Queremos buscar el objeto tipo producto que tenga como slug
  // ?el slug del parametro, y ponemos 0 porque devuelve una lista, y
  // ?queremos el objeto como tal
  const query = `*[_type=="product" && slug.current=='${slug}'][0]`;
  const product = await client.fetch(query);

  // ?Para los productos 'relacionados'
  const productsQuery = '*[_type=="product"]';
  const products = await client.fetch(productsQuery);

  return { props: { product, products } };
};

export default ProductDetails;
