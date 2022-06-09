//Variables

const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

eventListeners();
function eventListeners(){
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);
    formulario.addEventListener("submit", nuevaCita)
}

class Citas{
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }
    quitarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");
        tipo === "error" ? divMensaje.classList.add("alert-danger") : divMensaje.classList.add("alert-success");
        divMensaje.textContent = mensaje;
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"));
        setTimeout( () =>{
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas(citasA){
        this.limpiarHTML();
        const { citas } = citasA;
        citas.forEach( (cita) =>{
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-weight-bolder");
            mascotaParrafo.textContent = mascota;
            divCita.appendChild(mascotaParrafo);

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario:</span> ${propietario}`;
            divCita.appendChild(propietarioParrafo);

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono:</span> ${telefono}`; 
            divCita.appendChild(telefonoParrafo);

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolden">Fecha: </span> ${fecha}`;
            divCita.appendChild(fechaParrafo);

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
                <span class="font-weight-bolden">Hora: </span> ${hora}`;
            divCita.appendChild(horaParrafo);

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolden">Síntomas: </span> ${sintomas}`;
            divCita.appendChild(sintomasParrafo);
            
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mt-2")
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>`;
            divCita.appendChild(btnEliminar);
            //Funcionalidad 
            btnEliminar.onclick = () => eliminarCita(id)

            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

const ui = new UI();
const administrarCitas = new Citas();

function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

function nuevaCita(e){
    e.preventDefault();
    //Extrae la información del objeto
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar
    if( mascota.trim() === "" || propietario.trim() === "" || telefono.trim() === "" || fecha.trim() === "" || hora.trim() === "" || sintomas.trim() === ""){
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    //Generar un id único
    citaObj.id = Date.now();
    //Crear una nueva cita y elimina con la copia la referencia en todos los elementos del array al ultimo citaObj añadido
    administrarCitas.agregarCita( {...citaObj} );
    resetObjeto();
    formulario.reset();
    ui.imprimirCitas(administrarCitas);
}

function resetObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}
function eliminarCita(id){
    // Llamar metodo eliminar citas de Administrar Citas
    administrarCitas.quitarCita(id);
    // Mostrar un mensaje
    ui.imprimirAlerta("Cita eliminada correctamente");
    // Mostrar la lista actualizada de citas
    ui.imprimirCitas(administrarCitas)
}
