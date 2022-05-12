import React from "react";
import Link from "next/link";

import { urlFor } from "../lib/client";

export const Product = ({ product: { name, image, slug, price } }) => {
  return (
    <div>
      {/*?El slug se refiere a un tipo de id unico para el producto*/}
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <img
            // ?Se refiere a si existen imagenes, y acordemonos que los
            // ?productos puede tener varias, entonces agarramos la primera
            // ?de la lista
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="product-image"
          />
          <p className="product-name">{name}</p>
          <p className="product-price">₡{price}</p>
        </div>
      </Link>
    </div>
  );
};
