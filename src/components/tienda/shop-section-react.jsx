import axios from "axios"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';

export default function ShopSectionReact () {

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProductos = async () => {
            try {

                const resProductos = await axios.get("https://backend.pevite.com.ve/admin/productos")

                if (resProductos.status == 200){
                    if (resProductos.data.length <= 0 ) {
                        throw new Error("No hay productos");
                    }
                    return setProductos(resProductos.data)
                }

                if (response.status === 400) {
                    throw new Error("Solicitud incorrecta");
                }
                
                if (!response.ok) {
                    throw new Error("Producto no encontrado");
                }

                

                
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProductos()
    }, [])


    if (loading) {
        return <div className="errorPeticion">Cargando productos...</div>;
    }

    if (error) {

        if (error.includes("Network Error")) {
            return (
                <div className="errorPeticion">
                    El servidor no está en línea. Por favor, inténtelo más tarde.
                </div>
            );
        }

        console.log(error)

        return (
            
            <div className="errorPeticion">
                {error}
            </div>
        );
    }
/* 
    const irProducto = (id) => {

        return window.location.href = '/tienda/producto/' + id;

    } */

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
            tipoProducto: producto.tipoProducto
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
        <section className="shop-section pt-130 pb-130">
            <div className="container">
                <div className="row gy-4">
                    {productos.map((producto) =>  
                    <div  key={producto.id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="shop-item">
                            <div /* onClick={() => irProducto(producto.id)} */  className="shop-thumb">
                                <div className="overlay"></div>
                                <img src={"https://backend.pevite.com.ve/" + producto.imagenes.small[0]} alt={producto.titulo} /> 
                                {producto.enOferta ? (
                                <span className="sale">Oferta</span>
                                ) : null }
                        
                                <ul className="shop-list">
                                    <li><a onClick={() => addCart(producto)}><i className="fa-regular fa-cart-shopping"></i></a></li>
                                    {/* <li><a><i className="fa-light fa-heart"></i></a></li> */}
                                    <li><a href={`/tienda/producto/${producto.id}`}><i className="fa-light fa-eye"></i></a></li>
                                </ul>
                            </div>
                            <div className="shop-content">
                                <span className="category">{producto.tipoProducto}</span>
                                <h3 className="title"><a href={`/tienda/producto/${producto.id}`}>{producto.titulo}</a><span> { producto.precioMin ? ( <span className="offer">$ {producto.precioMin}</span>): null} $ {producto.precioMax}</span></h3>
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
