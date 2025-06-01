import axios from 'axios';
import { useEffect, useState } from "react";

export default function ContactForm(){

    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        fullname: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
    });

    const [validacionesFormulario, setvalidacionesFormulario] = useState({})

    const handleChange = (e) => {

        if (e.target.id == "fullname") {
            const { value } = e.target;
            setFormData({...formData, fullname: value});
        }

        if (e.target.id == "lastname") {
            const { value } = e.target;
            setFormData({...formData, lastname: value});
        }
        
        if (e.target.id == "email") {
            const { value } = e.target;
            setFormData({...formData, email: value});
        }

        if (e.target.id == "phone") {
            const { value } = e.target;
            setFormData({...formData, phone: value});
        }

        if (e.target.id == "message") {
            const { value } = e.target;
            setFormData({...formData, message: value});
        }

    }

const submit = async () => {
    try {
        const res = await axios.post("http://localhost:4000/admin/contacto", formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Estado para los datos del formulario
        setFormData({
            fullname: '',
            lastname: '',
            email: '',
            phone: '',
            message: ''
        });
        
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de error (4xx, 5xx)
            setvalidacionesFormulario(error.response?.data.errors || {});
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta (servidor caído)
            alert("El servidor no está en línea. Por favor, inténtelo más tarde.");
        } else {
            // Error al configurar la petición
            alert("Ocurrió un error inesperado. Por favor, inténtelo nuevamente.");
        }
    }
}


/*   
  
  // Estados para el proceso de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'


  

   */

    return (
    
        <section className="contact-section pt-130 pb-130">
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
                                <form className="form-horizontal">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input onChange={handleChange} value={formData.fullname} type="text" id="fullname" name="fullname" className="form-control" placeholder="Su nombre"/>
                                            </div>
                                            

                                                
                                            {(validacionesFormulario.fullname?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.fullname?.[0]}
                                                </div>
                                            )}
                                            
       
                                            
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input onChange={handleChange} value={formData.lastname} type="text" id="lastname" name="lastname" className="form-control" placeholder="Apellido"/>
                                            </div>

                                            {(validacionesFormulario.lastname?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.lastname?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input onChange={handleChange} value={formData.email}  type="text" id="email" name="email" className="form-control" placeholder="Dirección de correo electrónico"/>
                                            </div>

                                            {(validacionesFormulario.email?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.email?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-item">
                                                <input onChange={handleChange} value={formData.phone} type="text" id="phone" name="phone" className="form-control" placeholder="Número de teléfono"/>
                                            </div>

                                            {(validacionesFormulario.phone?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.phone?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="form-item message-item">
                                                <textarea onChange={handleChange} value={formData.message} id="message" name="message" cols="30" rows="5" className="form-control address" placeholder="Mensaje"></textarea>
                                            </div>

                                            {(validacionesFormulario.message?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.message?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="submit-btn">
                                        <input onClick={submit} id="submit" className="rr-primary-btn" value="Enviar mensaje" type="button"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )

}


