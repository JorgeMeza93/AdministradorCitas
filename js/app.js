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

            contenedorCitas.appendChild(divCita);
        });
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