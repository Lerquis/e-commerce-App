import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// !SI SALEN ERRORES, SON POR LOS DATOS QUE SE ENCUENTRAN AQUI
// !Para entender de los errores, entrar al siguiente link
// !Es el registro de las peticiones
// ?https://dashboard.stripe.com/test/logs?method%5B0%5D=post&method%5B1%5D=delete&direction%5B0%5D=connect_in&direction%5B1%5D=self

// ?Para poder imprimir aqui, NO SALE EN LA CONSOLA DE INTERNET!! Sale
// ?en la consola de la terminal
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [{ shipping_rate: "shr_1KyP3hDWF6QR92LXOc2GppDF" }],
        // ?El req.body.map ya tiene todos los items del cartItems
        line_items: req.body.map((item) => {
          //? Tenemos solamente la referencia de la imagen
          const img = item.image[0].asset._ref;
          // ?Aqui agarramos la url de nuestro proyecto, con nuestro
          // ?token 'hloj6exb' asi podemos desplegar las imagenes de
          // ?cada producto
          const newImage = img
            .replace(
              "image-",
              "https://cdn.sanity.io/images/hloj6exb/production/"
            )
            .replace("-webp", ".webp");

          return {
            // ?IMPORTANTE TODOS ESTOS DATOS PARA QUE FUNCIONE!!
            price_data: {
              currency: "crc",
              product_data: {
                name: item.name,
                images: [newImage],
              },
              // ?Algo de que el amount tiene que estar en centavos
              // ?(si es en dolares)
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),
        // ?URLS donde uno puede redirigir en caso de compra o caso de
        // ?fallo
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
