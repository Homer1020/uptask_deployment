import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            // request hacia /tareas:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {idTarea})
                .then(res => {
                    if(res.status === 200) {
                        icono.classList.toggle('completo')
                    }
                    actualizarAvance();
                });
        }
        if(e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;
            
            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: 'Una Tarea eliminada no se puede recuperar',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'No, Cancelar'
            }).then(result => {
                if(result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // Enviar el delete por medio de axios
                    axios.delete(url, {params: { idTarea }})
                        .then(res => {
                            if(res.status === 200) {
                                // Eliminar el Nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                // Opcional una alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    res.data,
                                    'success'
                                );

                                actualizarAvance();
                            }
                        });
                }
            })
        }
    });
}

export default tareas;