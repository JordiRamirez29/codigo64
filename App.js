import React, {useState} from 'react';
import {APIfetch, APIsrv} from "./API";

function CargarFotos() {
    const [imagen, setImagen] = useState(null); // Solo una imagen
    const [numeroEmpleado, setNumeroEmpleado] = useState(null);
    const [error, setError] = useState(null);

    const manejarSeleccionArchivo = (e) => {
        const archivo = e.target.files[0]; // Tomar solo el primer archivo seleccionado

        if (archivo) {
            if (!archivo.name.toLowerCase().endsWith('.jpg') &&
                !archivo.name.toLowerCase().endsWith('.jpeg') &&
                !archivo.name.toLowerCase().endsWith('.png')) {
                setError(`El archivo ${archivo.name} no es un archivo válido.`);
                return;
            }

            const nuevoNumeroEmpleado = archivo.name.split('.')[0]; // Obtener número de empleado del nombre del archivo
            setNumeroEmpleado(nuevoNumeroEmpleado);

            const lector = new FileReader();
            lector.onloadend = () => {
                const base64String = lector.result.split(',')[1]; // Obtener el contenido en base64
                setImagen({numeroEmpleado: nuevoNumeroEmpleado, base64String, preview: lector.result});
                setError(null); // Limpiar cualquier error anterior
            };
            lector.readAsDataURL(archivo);
        }
    };

    function cargarFoto() {
        if (imagen) {
            const parametros = {
                clave: imagen.numeroEmpleado,
                selfie: imagen.base64String,
            };
            APIfetch(APIsrv.CARGA_FOTOS, parametros, (response) => {
                console.log(response);
            });
        } else {
            console.error("No hay imagen para cargar.");
            setError("Debe seleccionar una imagen antes de cargar.");
        }
    }

    return (
        <div>
            <h1>Cargar Foto de Empleado</h1>
            <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={manejarSeleccionArchivo}
            />
            <button onClick={cargarFoto}>Cargar Foto</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {imagen && (
                <div style={{marginBottom: '20px'}}>
                    <h3>Empleado: {imagen.numeroEmpleado}</h3>
                    <img
                        src={imagen.preview}
                        alt={`Vista previa de ${imagen.numeroEmpleado}`}
                        style={{maxWidth: '100px', marginBottom: '10px'}}
                    />
                    <textarea
                        value={imagen.base64String}
                        rows="5"
                        cols="80"
                        readOnly
                        style={{whiteSpace: 'nowrap', display: 'block', marginBottom: '10px'}}
                    />
                </div>

            )}
        </div>
    );
}

export default CargarFotos;
