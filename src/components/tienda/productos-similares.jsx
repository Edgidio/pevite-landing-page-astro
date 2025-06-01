import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify";

export const ProductosPimilares = ({id}) => {

    const [productos, setProductos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        // Verificar si el ID es un número válido
        if (isNaN(id) || !Number.isInteger(Number(id))) {
            setError("Producto no encontrado");
            setLoading(false);
            return;
        }

        // Hacer la consulta a la API
        const fetchProducto = async () => {
            try {
                const response = await fetch(`https://backend.pevite.com.ve/admin/productos/${id}/similar`);



                if (response.status === 404) {
                    throw new Error("Producto no encontrado");
                }

                if (response.status === 400) {
                    throw new Error("Solicitud incorrecta");
                }
            
                
                if (!response.ok) {
                    throw new Error("Producto no encontrado");
                }

                
                const data = await response.json();

                

                setProductos(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();

    }, [id]);


    
    if (loading) {
        return <div ></div>;
    }

    if (error) {

        if (error.includes("Failed to fetch")) {
            return (
                <div >
                    
                </div>
            );
        }

        return (
            <div >
                
            </div>
        );
    }

    if (!productos) {
        return <div ></div>;
    }


            const addCart  = (producto) => {
        
        
                const carrito_actual = JSON.parse(localStorage.getItem("cart")) || []
        
                // Buscar si el producto ya está en el carrito
                const existingItemIndex = carrito_actual.findIndex(item => item.id === producto.id);
        
                  
                if (existingItemIndex >= 0) {
                    // Si existe, incrementar cantidad
                    carrito_actual[existingItemIndex].cantidad += 1;
                } else {
                    // Si no existe, añadir nuevo item
                    carrito_actual.push({
                    id: producto.id,
                    titulo: producto.titulo,
                    precioMax: producto.precioMax,
                    imagen: producto.imagenes.small[0], // Tomamos la primera imagen pequeña
                    cantidad: 1,
                    sku: producto.sku,
                    envioGratis: producto.envioGratis,
                    tipoProducto: producto.tipoProducto,
                    });
                }
        
                // Guardar en localStorage
                localStorage.setItem('cart', JSON.stringify(carrito_actual));
                
                // Disparar evento personalizado para notificar a otros componentes
                window.dispatchEvent(new CustomEvent('cart-updated'));
        
                toast.success( `Producto agregado al carrito satisfactoriamente!`, {
                    position: "bottom-right",
                    theme: "dark",
                })
                
                return carrito_actual;
        
            }


    
  return (
    
    
        <section className="shop-section pb-130">
            <div className="container">
                <div className="section-heading text-center">
                    <h4 className="sub-heading" data-text-animation="fade-in" data-duration="1.5">Productos similares</h4>
                    <h2 className="section-title" data-text-animation data-split="word" data-duration="1">Productos más recientes</h2>
                </div>
                
                <div className="row gy-lg-0 gy-4">
                    { productos.map( (producto)=> 
                    
                    <div key={producto.id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="shop-item">
                            <div className="shop-thumb">
                                <div className="overlay"></div>
                                <img src={`https://backend.pevite.com.ve/${producto.imagenes.small[0]}`} alt="shop" />
                                <ul className="shop-list">
                                    <li><a onClick={() => addCart(producto)}><i className="fa-regular fa-cart-shopping"></i></a></li>
                                    <li><a href={`/tienda/producto/${producto.id}`}><i className="fa-light fa-eye"></i></a></li>
                                </ul>
                            </div>
                            <div className="shop-content">
                                <span className="category">{producto.tipoProducto}</span>
                                <h3 className="title"><a href="shop-details.html">{producto.titulo}</a><span>$ {producto.precioMax}</span></h3>
                            </div>
                        </div>
                    </div>                  
                
                    )}


                    <ToastContainer 
                    position="bottom-right"
                    theme="dark"/>
            

                    
                </div>
                
            </div>
            
        </section>

  )
}
