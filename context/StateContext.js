import React, { createContext, useContext, useState, useEffect } from "react";

// ?Toast es para animaciones
import { toast } from "react-hot-toast";

// ?Creamos el context
const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct, index;

  const onAddCart = (product, quantity) => {
    // ?Buscamos si el producto lo tenemos adentro de carro
    // ?porque si es asi, es mejor subir la cantidad a agregar
    // ?mismos productos
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart`);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    // ?Devolvemos una lista sin el producto que le estamos modificando
    // ?la cantidad, asi podemos actualizarla SIN MUTAR EL ESTADO
    let newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      // ?Creamos la nueva lista, donde modificamos solamente el producto
      // ?al que se le hizo el cambio
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);

      // ?Seteamos los nuevos estados
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      // ?Tiene que al menos tener + 1 para poder hacer el decremento
      // ?ya que no vamos a poner cero, para eso que elimine el producto
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);

    // ?Devolvemos una lista sin el producto que le estamos modificando
    // ?la cantidad, asi podemos actualizarla SIN MUTAR EL ESTADO
    let newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );

    setCartItems(newCartItems);
  };

  const incQty = () => {
    // ?De parametro, por default, es siempre el estado actual,
    // ?en este caso de qty
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    // ?Devolvemos el Context, que siempre tiene que tener el
    // ?.provider ademas de los valores que se quieren mantener de
    // ?manera global
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        showCart,
        incQty,
        decQty,
        onAddCart,
        setShowCart,
        setQty,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// ?Para poder usar este StateContext, ocupamos inicializarlo con un
// ?useStateContext
export const useStateContext = () => useContext(Context);
