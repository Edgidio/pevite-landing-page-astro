import axios from 'axios';
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactForm() {
    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        fullname: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
    });

    const [validacionesFormulario, setValidacionesFormulario] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Limpiar validación al escribir
        if (validacionesFormulario[id]) {
            setValidacionesFormulario(prev => {
                const newErrors = {...prev};
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidacionesFormulario({});

        try {
            const res = await axios.post("https://backend.pevite.com.ve/admin/contacto", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Resetear formulario
            setFormData({
                fullname: '',
                lastname: '',
                email: '',
                phone: '',
                message: ''
            });

            if (res.data.includes("¡Gracias por escribirnos! ✉️ Ya")){

                            // Mostrar notificación de éxito
                toast.info(res.data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                return 
            }

            // Mostrar notificación de éxito
            toast.success(res.data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
        } catch (error) {
            if (error.response) {
                // Validaciones del servidor
                if (error.response?.data.errors) {
                    setValidacionesFormulario(error.response.data.errors);
                } else {
                    toast.error('Error al enviar el mensaje', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else if (error.request) {
                toast.error('El servidor no responde. Intente más tarde', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Error inesperado. Por favor intente nuevamente', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-section pt-130 pb-130">
            <ToastContainer />
            <div className="container">
                <div className="row gy-lg-0 gy-5">
                    <div className="col-lg-5 col-md-12">
                        <div className="contact-content">
                            <div className="section-heading">
                                <h4 className="sub-heading after-none" data-text-animation="fade-in" data-duration="1.5">Contáctanos</h4>
                                <h2 className="section-title" data-text-animation data-split="word" data-duration="1">Trabajemos juntos</h2>
                                <p>Gracias por tu interés en PEVITE. Estamos emocionados de escucharte y discutir cómo podemos transformar tus ideas en soluciones tecnológicas innovadoras...</p>
                            </div>
                            <div className="contact-list">
                                <div className="list-item">
                                    <div className="icon">
                                        <i className="fa-light fa-location-dot"></i>
                                    </div>
                                    <div className="content">
                                        <h4 className="title">Nuestra Dirección</h4>
                                        <p>Maracay, Edo. Aragua, Venezuela</p>
                                    </div>
                                </div>
                                <div className="list-item">
                                    <div className="icon">
                                        <i className="fa-light fa-phone"></i>
                                    </div>
                                    <div className="content">
                                        <h4 className="title">Número de Teléfono</h4>
                                        <span><a href="tel:584120936057">+58 412-0936057</a></span> 
                                        <span><a href="tel:+584123584174">+58 412-3584174</a></span> 
                                        <span><a href="mailto:contacto@pevite.com.ve">contacto@pevite.com.ve</a></span>
                                    </div>
                                </div>
                                <div className="list-item">
                                    <div className="icon">
                                        <i className="fa-light fa-clock"></i>
                                    </div>
                                    <div className="content">
                                        <h4 className="title">Horario de Atención</h4>
                                        <span>Lunes - Viernes: 7:00 a.m - 6:30 p.m</span>
                                        <span>Sábado & Domingo: Cerrado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="blog-contact-form form-2">
                            <div className="request-form">
                                <form onSubmit={submit} className="form-horizontal">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input 
                                                    onChange={handleChange} 
                                                    value={formData.fullname} 
                                                    type="text" 
                                                    id="fullname" 
                                                    name="fullname" 
                                                    className={`form-control ${validacionesFormulario.fullname ? 'is-invalid' : ''}`} 
                                                    placeholder="Su nombre"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {validacionesFormulario.fullname?.[0] && (
                                                <div className='validaciones text-danger'>
                                                    {validacionesFormulario.fullname[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input 
                                                    onChange={handleChange} 
                                                    value={formData.lastname} 
                                                    type="text" 
                                                    id="lastname" 
                                                    name="lastname" 
                                                    className={`form-control ${validacionesFormulario.lastname ? 'is-invalid' : ''}`} 
                                                    placeholder="Apellido"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {validacionesFormulario.lastname?.[0] && (
                                                <div className='validaciones text-danger'>
                                                    {validacionesFormulario.lastname[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input 
                                                    onChange={handleChange} 
                                                    value={formData.email} 
                                                    type="email" 
                                                    id="email" 
                                                    name="email" 
                                                    className={`form-control ${validacionesFormulario.email ? 'is-invalid' : ''}`} 
                                                    placeholder="Dirección de correo electrónico"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {validacionesFormulario.email?.[0] && (
                                                <div className='validaciones text-danger'>
                                                    {validacionesFormulario.email[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input 
                                                    onChange={handleChange} 
                                                    value={formData.phone} 
                                                    type="tel" 
                                                    id="phone" 
                                                    name="phone" 
                                                    className={`form-control ${validacionesFormulario.phone ? 'is-invalid' : ''}`} 
                                                    placeholder="Número de teléfono"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {validacionesFormulario.phone?.[0] && (
                                                <div className='validaciones text-danger'>
                                                    {validacionesFormulario.phone[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="form-item message-item">
                                                <textarea 
                                                    onChange={handleChange} 
                                                    value={formData.message} 
                                                    id="message" 
                                                    name="message" 
                                                    cols="30" 
                                                    rows="5" 
                                                    className={`form-control address ${validacionesFormulario.message ? 'is-invalid' : ''}`} 
                                                    placeholder="Mensaje"
                                                    disabled={isSubmitting}
                                                ></textarea>
                                            </div>
                                            {validacionesFormulario.message?.[0] && (
                                                <div className='validaciones text-danger'>
                                                    {validacionesFormulario.message[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="submit-btn">
                                        <button 
                                            type="submit" 
                                            className="rr-primary-btn" 
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}