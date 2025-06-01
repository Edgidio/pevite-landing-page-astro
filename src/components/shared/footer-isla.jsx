import { useState } from "react";
import axios from 'axios';

function Subscriber() {

    const [correo, setCorreo] = useState('');
    const [validacionesFormulario, setvalidacionesFormulario] = useState({})

    const handleEmailChange = (e) => {
        setCorreo(e.target.value); 
    };

    const submit = async () => {
         try {
            const res = await axios.post("http://localhost:4000/admin/subscribes/", {
                email: correo
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setCorreo('')
        
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de error (4xx, 5xx)
                setvalidacionesFormulario(error.response?.data.errors || error.response?.data || {});
        

            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta (servidor caído)
                alert("El servidor no está en línea. Por favor, inténtelo más tarde.");
            } else {
                // Error al configurar la petición
                alert("Ocurrió un error inesperado. Por favor, inténtelo nuevamente.");
            }
        }
    }

  return (
    
      <div className="col-lg-3 col-md-6">
        <div className="footer-widget">
          <div className="widget-header">
            <h3 className="widget-title">Suscríbete al boletín informativo</h3>
          </div>
          <div className="footer-form mb-20">
            <form className="rr-subscribe-form">
              <input
                id="email" 
                className="form-control" 
                type="email" 
                name="email" 
                placeholder="Correo electrónico"
                onChange={handleEmailChange}
                value={correo}
              />
              <input type="hidden" name="action" value="mailchimpsubscribe" />
              <input id="inscribirse" type="button" value="Inscribirse" onClick={submit} className="submit" />
              <div className="clearfix"></div>
            </form>
          </div>
          <div className="form-check form-item">
            <input className="form-check-input" type="checkbox" value="" id="man" />
            
            <label className="form-check-label">
              Estoy de acuerdo con recibir correos electrónicos y hacer un seguimiento de ellos para mejorar mi experiencia.
            </label>

          </div>

          <br />

                                            {(validacionesFormulario.email?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.email?.[0]}
                                                </div>
                                            )}
{/* 
                                            {(validacionesFormulario.message?.[0]) && (
                                                <div className='validaciones'>
                                                    {validacionesFormulario.message}
                                                </div>
                                            )}  */}
        </div>
      </div>

  );
}

export default Subscriber;