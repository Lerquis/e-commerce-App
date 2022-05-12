import "../styles/globals.css";
import { Layout } from "../components/";
import { StateContext } from "../context/StateContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  // ?Renderiza el componente de layout, donde por los props le pasamos
  // ?el children, es decir, un componente hijo, donde por ejemplo
  // ?esta el herobanner, el footer y todo eso.
  // ?Este layout funciona para tener un cuerpo mas parecido al
  // ?de html, donde empezar por el head, poner un title, despues
  // ?header / main / footer y asi se ponen los hijos a renderizar
  return (
    <StateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  );
}

export default MyApp;
