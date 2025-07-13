import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';

export const DatosUsuarioCompra = () => {
    const [carrito_actual, setCarrito_actual] = useState([]);
    const [total, setTotal] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        lastname: '',
        company: '',
        phone: '',
        message: '',
        paymentMethod: '',
        terms: false
    });

    // Cargar carrito y calcular total
    useEffect(() => {
        const carrito = JSON.parse(localStorage.getItem("cart")) || [];
        
        if (carrito.length <= 0) {
            window.location.href = '/tienda/carrito';
        } else {
            setCarrito_actual(carrito);
            const calculatedTotal = carrito.reduce((sum, producto) => {
                return sum + parseFloat(producto.precioMax || 0);
            }, 0);
            setTotal(calculatedTotal);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.email) newErrors.email = 'El correo electrónico es requerido';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Correo electrónico inválido';
        
        if (!formData.fullname) newErrors.fullname = 'El nombre es requerido';
        if (!formData.lastname) newErrors.lastname = 'El apellido es requerido';
        if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
        else if (!/^\d+$/.test(formData.phone)) newErrors.phone = 'Teléfono debe contener solo números';
        
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Debe seleccionar un método de pago';
        if (!formData.terms) newErrors.terms = 'Debe aceptar los términos y condiciones';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const comprar = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.warn('Por favor complete todos los campos requeridos correctamente.', {
                position: "top-right",
                theme: "dark",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Preparar los productos para el envío
            const productos = carrito_actual.map(producto => ({
                id: producto.id,
                cantidad: producto.cantidad || 1 // Asume cantidad 1 si no está definida
            }));

            // Datos para enviar al backend
            const orderData = {
                email: formData.email,
                fullname: formData.fullname,
                lastname: formData.lastname,
                paymentMethod: formData.paymentMethod,
                phone: formData.phone,
                terms: formData.terms,
                productos: productos,
                message: formData.message,
                company: formData.company
            };

            // Hacer la petición POST
            const response = await axios.post('https://backend.pevite.com.ve/admin/orders', orderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (response.status == 201) {
                toast.success('¡Pedido realizado con éxito! Redireccionando...', {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 3000
                });

                // Limpiar carrito
                localStorage.removeItem("cart");

                // Redireccionar después de 3 segundos
                setTimeout(() => {
                    window.location.href = '/tienda/productos';
                }, 3000);
            } else {
                toast.error(response.data.message || 'Error al procesar el pedido', {
                    position: "top-right",
                    theme: "dark",
                });
            }
        } catch (error) {
            console.log('Error al realizar el pedido:', error);
            
            if (error.response) {
                // El servidor respondió con un código de error
                toast.error(error.response.data.message || 'Error al procesar el pedido', {
                    position: "top-right",
                    theme: "dark",
                });
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                toast.error('El servidor no está respondiendo. Por favor intente más tarde.', {
                    position: "top-right",
                    theme: "dark",
                });
            } else {
                // Error al configurar la petición
                toast.error('Error al conectar con el servidor', {
                    position: "top-right",
                    theme: "dark",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="row">
            <div className="col-lg-6 col-md-12">
                <div className="checkout-left">
                    <h3 className="form-header">Detalles de facturación</h3>
                    <form onSubmit={comprar}>
                        <div className="checkout-form-wrap">
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-item">
                                        <h4 className="form-title">Dirección de correo electrónico*</h4>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="form-item name">
                                        <h4 className="form-title">Nombre de pila*</h4>
                                        <input 
                                            type="text" 
                                            id="fullname" 
                                            name="fullname" 
                                            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.fullname && <div className="text-danger small">{errors.fullname}</div>}
                                </div>
                                <div className="col-md-6">
                                    <div className="form-item">
                                        <h4 className="form-title">Apellido*</h4>
                                        <input 
                                            type="text" 
                                            id="lastname" 
                                            name="lastname" 
                                            className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.lastname && <div className="text-danger small">{errors.lastname}</div>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-item">
                                        <h4 className="form-title">Nombre de la empresa (opcional)</h4>
                                        <input 
                                            type="text" 
                                            id="company" 
                                            name="company" 
                                            className="form-control"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-item">
                                        <h4 className="form-title">Telefono*</h4>
                                        <input 
                                            type="text" 
                                            id="phone" 
                                            name="phone" 
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-item">
                                        <h4 className="form-title">Notas del pedido (opcional)</h4>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            cols="30" 
                                            rows="5" 
                                            className="form-control address"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="col-lg-6 col-md-12">
                <div className="checkout-right">
                    <h3 className="form-header">Su pedido</h3>
                    <div className="order-box">
                        <div className="order-items">
                            <div className="order-item item-1">
                                <div className="order-left">
                                    <span className="product">Productos</span>
                                </div>
                                <div className="order-right">
                                    <span className="price">Precio</span>
                                </div>
                            </div>
                            {carrito_actual.map((producto) => 
                                <div key={producto.id} className="order-item">
                                    <div className="order-left">
                                        <div className="order-img">
                                            <img src={`https://backend.pevite.com.ve/${producto.imagen}`} alt="img" />
                                        </div>
                                    </div>
                                    <div className="order-right">
                                        <div className="content">
                                            <span className="category">{producto.tipoProducto}</span>
                                            <h4 className="title">{producto.titulo}</h4>
                                        </div>
                                        <span className="price">$ {producto.precioMax}</span>
                                    </div>
                                </div>
                            )}
                            <div className="order-item item-1">
                                <div className="order-left">
                                    <span className="left-title">Precio total:</span>
                                </div>
                                <div className="order-right">
                                    <span className="right-title title-2">$ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="payment-option-wrap">
                            <div className="payment-option">
                                <div className="shipping-option">
                                    <div className="options">
                                        <input 
                                            id="flat_rate" 
                                            type="radio" 
                                            name="shipping" 
                                            value="transferencia"
                                            onChange={() => setFormData({...formData, paymentMethod: 'transferencia'})}
                                        />
                                        <label htmlFor="flat_rate">Transferencia bancaria directa</label>
                                    </div>
                                    <p className="mb-0">
                                        Realice su pago directamente en nuestra cuenta bancaria. Utilice su número de pedido como referencia de pago. Su pedido no se enviará hasta que los fondos se hayan acreditado en nuestra cuenta.
                                    </p>
                                </div>
                                {errors.paymentMethod && <div className="text-danger small">{errors.paymentMethod}</div>}
                            </div>
                            <p className="desc">
                                Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra <span>política de privacidad.</span>
                            </p>
                            <div className="form-check">
                                <input 
                                    className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`} 
                                    type="checkbox" 
                                    id="flexCheckDefault"
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    name="terms"
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    He leído y acepto los términos y condiciones *
                                </label>
                                {errors.terms && <div className="text-danger small">{errors.terms}</div>}
                            </div>
                            <button 
                                type="button" 
                                onClick={comprar} 
                                className="rr-primary-btn order-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Procesando...' : 'Realizar su pedido'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                theme="dark"
            />
        </div>
    )
}
