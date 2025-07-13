import { useState } from "react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Subscriber() {
    const [correo, setCorreo] = useState('');
    const [validacionesFormulario, setValidacionesFormulario] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const handleEmailChange = (e) => {
        setCorreo(e.target.value);
        // Limpiar validación cuando el usuario escribe
        if (validacionesFormulario.email) {
            setValidacionesFormulario(prev => ({...prev, email: undefined}));
        }
    };

    const handleTermsChange = (e) => {
        setTermsChecked(e.target.checked);
        // Limpiar validación cuando el usuario marca/desmarca
        if (validacionesFormulario.terms) {
            setValidacionesFormulario(prev => ({...prev, terms: undefined}));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(correo)) {
            newErrors.email = 'Por favor ingrese un correo electrónico válido';
        }

        if (!termsChecked) {
            newErrors.terms = 'Debe aceptar los términos para suscribirse';
        }

        setValidacionesFormulario(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post("https://backend.pevite.com.ve/admin/subscribes/", {
                email: correo
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setCorreo('');
            setTermsChecked(false);
            
            toast.success('¡Suscripción exitosa! Gracias por unirte.', {
                position: "bottom-right",
                theme: "dark",
            });

        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de error (4xx, 5xx)
                const serverErrors = error.response?.data?.errors || error.response?.data || {};
                setValidacionesFormulario(serverErrors);
                
                // Mostrar error principal si existe
                if (error.response.data.message) {
                    toast.error(error.response.data.message, {
                        position: "bottom-right",
                        theme: "dark",
                    });
                }
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta (servidor caído)
                toast.error('El servidor no está respondiendo. Por favor, inténtelo más tarde.', {
                    position: "bottom-right",
                    theme: "dark",
                });
            } else {
                // Error al configurar la petición
                toast.error('Error de conexión. Por favor, verifique su internet.', {
                    position: "bottom-right",
                    theme: "dark",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="col-lg-3 col-md-6">
            <ToastContainer />
            <div className="footer-widget">
                <div className="widget-header">
                    <h3 className="widget-title">Suscríbete al boletín informativo</h3>
                </div>
                <div className="footer-form mb-20">
                    <form className="rr-subscribe-form" onSubmit={submit}>
                        <input
                            id="email" 
                            className={`form-control ${validacionesFormulario.email ? 'is-invalid' : ''}`} 
                            type="email" 
                            name="email" 
                            placeholder="Correo electrónico"
                            onChange={handleEmailChange}
                            value={correo}
                        />

                        <input type="hidden" name="action" value="mailchimpsubscribe" />
                        <button 
                            type="submit" 
                            className="submit" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Inscribirse'}
                        </button>
                        
                        <div className="clearfix"></div>
                        
                    </form>
                    
                </div>
                        {validacionesFormulario.email && (
                            <div className="text-danger small mt-1">
                                {validacionesFormulario.email}
                            </div>
                        )}
                <div className="form-check form-item">
                    <input 
                        className={`form-check-input ${validacionesFormulario.terms ? 'is-invalid' : ''}`} 
                        type="checkbox" 
                        id="terms" 
                        checked={termsChecked}
                        onChange={handleTermsChange}
                    />
                    <label className="form-check-label" htmlFor="terms">
                        Estoy de acuerdo con recibir correos electrónicos y hacer un seguimiento de ellos para mejorar mi experiencia.
                    </label>
                    {validacionesFormulario.terms && (
                        <div className="text-danger small mt-1">
                            {validacionesFormulario.terms}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subscriber;