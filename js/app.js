//Variables

const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");
let editando;
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
    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
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
                <span class="font-weight-bolder">Tel??fono:</span> ${telefono}`; 
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
                <span class="font-weight-bolden">S??ntomas: </span> ${sintomas}`;
            divCita.appendChild(sintomasParrafo);
            
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mt-2")
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>`;
            divCita.appendChild(btnEliminar);
            //Funcionalidad 
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-info");
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>`;
            divCita.appendChild(btnEditar);
            btnEditar.onclick = () => cargarEdicion(cita);

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
    //Extrae la informaci??n del objeto
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar
    if( mascota.trim() === "" || propietario.trim() === "" || telefono.trim() === "" || fecha.trim() === "" || hora.trim() === "" || sintomas.trim() === ""){
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    if(editando){
        ui.imprimirAlerta("Editado correctamente");
        administrarCitas.editarCita( {...citaObj } )
        formulario.querySelector("button[type='submit']").textContent = "Crear Cita";
        editando = false;
    }
    else{
        citaObj.id = Date.now();
         //Crear una nueva cita y elimina con la copia la referencia en todos los elementos del array al ultimo citaObj a??adido
        administrarCitas.agregarCita( {...citaObj} );
        ui.imprimirAlerta("Se ha agregado correctamente");
    }
    //Generar un id ??nico
    
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
function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    //Lenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios";
    editando = true;
}