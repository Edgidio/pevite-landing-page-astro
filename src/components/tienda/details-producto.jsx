import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { toast, ToastContainer } from "react-toastify";


export default function DetailsProducto({id}) {

    const [quantity, setQuantity] = useState(1);
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     // Añade este estado para controlar los thumbnails
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
                const response = await fetch(`http://localhost:4000/admin/productos/${id}`);



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
                setProducto(data);
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
        return <div className="errorPeticion">Cargando producto...</div>;
    }

    if (error) {

        if (error.includes("Failed to fetch")) {
            return (
                <div className="errorPeticion">
                    El servidor no está en línea. Por favor, inténtelo más tarde.
                </div>
            );
        }

        return (
            <div className="errorPeticion">
                {error}
            </div>
        );
    }

    if (!producto) {
        return <div className="errorPeticion">El producto no existe</div>;
    }

        const addCart  = (producto) => {
    
    
            const carrito_actual = JSON.parse(localStorage.getItem("cart")) || []
    
            // Buscar si el producto ya está en el carrito
            const existingItemIndex = carrito_actual.findIndex(item => item.id === producto.id);
    
              
            if (existingItemIndex >= 0) {
                // Si existe, incrementar cantidad
                carrito_actual[existingItemIndex].cantidad += quantity;
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
        <div>
            <section className="shop-section single pt-130 pb-130">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 product-details-wrap">
            
                            { producto.enOferta ? ( 
                                <span className="sale">Oferta</span>
                            ):  null }
                            
                            {/* Galería principal */}
                            <div className="product-gallary">
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    navigation={{
                                        nextEl: '.swiper-nav-next',
                                        prevEl: '.swiper-nav-prev'
                                    }}
                                    spaceBetween={10}
                                    thumbs={{ swiper: thumbsSwiper }}
                                >
                                    <SwiperSlide>
                                        <div className="gallary-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.medium[0]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="gallary-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.medium[1]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="gallary-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.medium[2]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                                <div className="swiper-nav-next"><i className="las la-arrow-right"></i></div>
                                <div className="swiper-nav-prev"><i className="las la-arrow-left"></i></div>
                            </div>
                            
                            {/* Mini galería (thumbnails) */}
                            <div className="product-gallary-thumb">
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    spaceBetween={10}
                                    slidesPerView={3}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                >
                                    <SwiperSlide>
                                        <div className="thumb-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.small[0]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="thumb-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.small[1]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="thumb-item">
                                            <img src={`http://localhost:4000/${producto.imagenes.small[2]}`} alt="shop"/>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="product-details">
                                <div className="product-info">
                                    <div className="product-inner">
                                        <span className="category">{producto.tipoProducto}</span>
                                        <h3 className="title">{producto.titulo}</h3>
                                        <div className="rating-wrap">
                                            <ul className="rating">
                                                <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                            </ul>
                                            <span></span>
                                        </div>
                                        <h4 className="price">{ producto.enOferta ? (<a>$ {producto.precioMin} - </a>): null } $ {producto.precioMax}</h4>
                                        <p className="desc">{producto.descripcionCorta}</p>
                                        <ul className="details-list">
                                            {producto.envioGratis ? (
                                                <div> 
                                                <li><i className="fa-light fa-arrow-right-arrow-left"></i>Envio gratis</li> 
                                                <li><i className="fa-light fa-truck"></i>Envío gratuito, totalmente asegurado.</li>
                                                </div>
                                            ): null}
                                            
                                        </ul>
                                    </div>
                                    <div className="product-btn">
                                        <form>
                                            <input onChange={(e) => setQuantity(Number(e.target.value))} type="number" name="age" id="age" min="1" max="100" step="1" value={quantity} />
                                        </form>
                                        <div><a onClick={() => addCart(producto)}  className="rr-primary-btn cart-btn">Añadir al carrito</a></div>
                                    </div>
                                    <ul className="product-meta">
                                        <li>SKU:<a >{producto.sku}</a></li>
                                        <li>Marca:<a >{producto.marca}</a></li>
                                        <li>Etiquetas:<a >{producto.etiquetas}</a></li>
                                        {producto.garantiaMeses ? ( <li>Garantia:<a >{producto.garantiaMeses} meses</a></li> ) : null}
                                        <li>Version:<a >{producto.version} V</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            

            <section className="product-description pb-130">
                <div className="container">
                    <ul className="nav tab-navigation" id="product-tab-navigation" role="tablist">
                        <li role="presentation">
                            <button className="active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
                                role="tab" aria-controls="home" aria-selected="true">Description</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="product-tab-content">
                        <div className="tab-pane fade show active description" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <p className="mb-30">{producto.descripcionLarga}</p>
                        </div>
                                                                <ToastContainer 
                    position="bottom-right"
                    theme="dark"/>
                    </div>
                </div>
            </section>
        </div>
    )
}
