// ?Creacion de los objetos para la base de datos
export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "array",
      // ?Se le como tipo array, 'de' objetos de imagen
      of: [{ type: "image" }],
      options: {
        hotspot: true,
      },
    },
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      // ?Slug es como un 'id'
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        // ?El source se basa en el name, creado arriba
        source: "name",
        maxLength: 90,
      },
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    { name: "details", title: "Details", type: "string" },
  ],
};
