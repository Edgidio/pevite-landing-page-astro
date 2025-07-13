import { useEffect, useState } from "react";

export const CartSection = () => {
    const [carrito_actual, setCarritoActual] = useState([]);

    // Cargar y preparar carrito inicial
    useEffect(() => {
        const cargarCarrito = () => {
            const carritoGuardado = JSON.parse(localStorage.getItem("cart")) || [];
            const carritoPreparado = carritoGuardado.map(item => ({
                ...item,
                cantidad: item.cantidad || 1,
                precioNumerico: parseFloat(item.precioMax) || 0
            }));
            setCarritoActual(carritoPreparado);
        };
        cargarCarrito();
    }, []);

    // Función para actualizar el localStorage
    const actualizarLocalStorage = (nuevoCarrito) => {
        localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
    };

    // Actualizar cantidad de un producto
    const actualizarCantidad = (id, nuevaCantidad) => {
        const cantidad = Math.max(1, Math.min(100, nuevaCantidad));
        setCarritoActual(prev => {
            const carritoActualizado = prev.map(item => 
                item.id === id ? { ...item, cantidad } : item
            );
            actualizarLocalStorage(carritoActualizado);
            return carritoActualizado;
        });
    };

    // Eliminar producto del carrito
    const eliminarProducto = (id) => {
        setCarritoActual(prev => {
            const carritoActualizado = prev.filter(item => item.id !== id);
            actualizarLocalStorage(carritoActualizado);
            return carritoActualizado;
        });
    };

    // Calcular subtotal
    const calcularSubtotal = (precio, cantidad) => {
        return (parseFloat(precio) * cantidad).toFixed(2);
    };

    const comprar = ()=> {
        return window.location.href = '/tienda/checkout';
    }

    return (
        <section className="cart-section pt-130 pb-130">
            <div className="container">
                <div className="table-content cart-table">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th className="product-remove"></th>
                                <th className="cart-product-name text-center">Productos</th>
                                <th className="product-price">Precio</th>
                                <th className="product-quantity">Cantidad</th>
                                <th className="product-subtotal">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito_actual.map((item) => (
                                <tr key={item.id}>
                                    <td className="product-remove">
                                        <button onClick={() => eliminarProducto(item.id)}>
                                            <i className="fa-sharp fa-regular fa-xmark"></i>
                                        </button>
                                    </td>
                                    <td className="product-thumbnail">
                                        <a href="shop-details.html">
                                            <img src={`https://backend.pevite.com.ve/${item.imagen}`} alt="img" />
                                        </a>
                                        <div className="product-thumbnail">
                                            <span className="category">{item.tipoProducto}</span>
                                            <h4 className="title">{item.titulo}</h4>
                                        </div>
                                    </td>
                                    <td className="product-price">
                                        <span className="amount">$ {item.precioMax}</span>
                                    </td>
                                    <td className="product-quantity">
                                        <div className="quantity__group">
                                            <input 
                                                type="number" 
                                                className="input-text qty text" 
                                                value={item.cantidad}
                                                min="1" 
                                                max="100"
                                                onChange={(e) => actualizarCantidad(
                                                    item.id, 
                                                    parseInt(e.target.value) || 1
                                                )}
                                            />
                                        </div>
                                    </td>
                                    <td className="product-subtotal">
                                        <span className="amount">
                                            $ {calcularSubtotal(item.precioMax, item.cantidad)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {carrito_actual.length === 0 && (
                        <h2 className="carrito_sin_productos">Carrito sin productos</h2>
                    )}
                </div>
                
                {carrito_actual.length > 0 && (
                    <div className="cart-btn-wrap">
                        <div className="left-item">
                            {/* Espacio reservado para futuras funcionalidades */}
                        </div>
                        <button onClick={comprar} className="rr-primary-btn">Comprar</button>
                    </div>
                )}
            </div>
        </section>
    );
};