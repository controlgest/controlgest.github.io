//?pConst=6&pDistrito=sadf456&pTerminal=45678d1_2025-02-03%2011:35_2025-03-13%2017:35,45678d2,45678d3,45678d4,45678d5,45678d6,45678d7,45678d8,45678d9,45678d0&pArea=leon&pCope=cope2&pTipoLum=P24
let UCTable = [];

const XAVApp = {
    initData: Telegram.WebApp.initData || '',
    initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
    MainButton: Telegram.WebApp.MainButton,

    init(options) {
        document.body.style.visibility = '';
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        Telegram.WebApp.MainButton.isProgressVisible = "true";
        Telegram.WebApp.MainButton.setParams({
            text: 'ENVIAR DATOS',
            is_visible: true,
            is_active: true
        });
    },

    close() {
        Telegram.WebApp.close();
    }
}

XAVApp.init();

$(document).ready(() => {
    const params = new URLSearchParams(document.location.search);
    if (params.size > 0) {
        cargarDatos(params);
    }

    document.getElementById('frmLum').addEventListener('submit', function (event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario al enviarse
    });
});

XAVApp.MainButton.onClick(() => {
    if (confirm("¿Está seguro de enviar los datos, ya no se podrán modificar?")) {
        sendDataToBot();
    }
});

let  cargarDatos =async (params) => {
    const inputManoObra = document.getElementById('txtManoDeObra');
    const autocompleteListManoObra = document.getElementById('manoDeObraAutocompleteList');
    const txtArea = document.getElementById('txtArea');
    const txtCope = document.getElementById('txtCope');
    const txtDistrito = document.getElementById('txtDistrito');
    const txtTerminal = document.getElementById('txtTerminal');
    const chkManoObra = document.getElementById('chkManoObra');
    const chkMateriales = document.getElementById('chkMateriales');
    const chkMatPreconectorizado = document.getElementById('chkMatPreconectorizado');
    const slcTipoRed = document.getElementById('slcTipoRed');
    const txtTipoLum = document.getElementById('txtTipoLum');
    const divCableUtilizado = document.getElementById('divCableUtilizado');
    const slcCableUtilizado = document.getElementById('slcCableUtilizado');
    const slcAlmacen = document.getElementById('slcAlmacen');
    const txtConstructor = document.getElementById('txtConstructor');
    // let txtFechaInicio = document.getElementById('txtFechaInicio');
    // let txtFechaFin = document.getElementById('txtFechaFin');

    let area = params.get("pArea");
    let cope = params.get("pCope");
    let distrito = params.get("pDistrito");
    let terminal = params.get("pTerminal");
    let idConstructor = params.get("pConst");
    let tipoLum = params.get("pTipoLum");
    // let fechaIni = params.get("pFIni");
    // let fechaFin = params.get("pFFin");

    chkManoObra.checked = true;
    txtArea.textContent = area.toUpperCase();
    txtCope.textContent = cope.toUpperCase();
    txtDistrito.textContent = distrito.toUpperCase();
    // txtTerminal.textContent = terminal.toUpperCase();
    txtTipoLum.textContent = tipoLum.toUpperCase();
    //fechas en formato yyyy-MM-dd HH:mm 
    // txtFechaInicio.value = fechaIni;
    // txtFechaFin.value = fechaFin;

    let constructor = null;

    if (idConstructor != null) {
        
        await fetch('./catalogos/catConstructores.json')
        .then(response => response.json())
        .then(data => {
            constructor = data.find(item => item.id_cconstructor == idConstructor);
            txtConstructor.textContent = constructor.constructor;
        });
        
        await fetch('./catalogos/cat_almacenes.json')
            .then(response => response.json())
            .then(data => {   
                             
                slcAlmacen.innerHTML = '<option value="">Seleccione un almacén</option>';
                for(let item of data){                    
                    if(item.constructor == constructor.constructor){
                        slcAlmacen.innerHTML += `<option value="${item.almacen} - ${item.nombre}">${item.almacen} - ${item.nombre}</option>`;
                    }
                }                
            });

            divAlmacen.hidden = await slcAlmacen.length > 1?false:true;
            slcAlmacen.required = await slcAlmacen.length > 1?true:false;

            //slcTerminal se llena con e parametro pTerminal que venen esparado por comas
            let terminales = terminal.split(',');
            
            const slcTerminal = document.getElementById('slcTerminal');
            slcTerminal.innerHTML = '<option value="">Seleccione una opción</option>';
            terminales.forEach(item => {
                slcTerminal.innerHTML += `<option value="${item.split('_')[0]}">${item.split('_')[0]}</option>`;
            });

            // agregar a divCoordenadas input para lat y long para cada una de las terminales
            const divCoordenadas = document.getElementById('divCoordenadas');
            divCoordenadas.innerHTML = '';
            terminales.forEach(item => {    
                divCoordenadas.innerHTML += `
                <div class="form-row col-md-6 col-12 mb-2 ">
                    <div class="col-12 p-0">
                        <label class="m-0" for="txtLat_${item.split('_')[0]}"><b>Terminal ${item.split('_')[0]}:</b></label>
                        <div class="d-flex justify-content-start align-items-center">
                            <label id="fechaIni_${item.split('_')[0]}"> <b>Fecha Inicio:</b> ${item.split('_')[1]} </label>
                            <label> - </label>
                            <label id="fechaFin_${item.split('_')[0]}"> <b>Fecha Fin:</b> ${item.split('_')[2]}</label>
                        </div>
                            
                    </div>
                    <div class="col-6 p-0 pr-2">    
                        <input type="number" id="txtLat_${item.split('_')[0]}" class="form-control" placeholder="Latitud de Terminal ${item.split('_')[0]}" required>
                    </div>
                    <div class="col-6 p-0 pl-2">    
                        <input type="number" id="txtLong_${item.split('_')[0]}" class="form-control" placeholder="Longitud de Terminal ${item.split('_')[0]}" required>
                    </div>
                </div>
                `;
            });
        }


    chkManoObra.ariaChecked = true;

    
}

let insertItemManoDeObraAutocompleteList = (autocompleteListManoObra, inputManoObra, item) => {

    const div = document.createElement('div');
    div.classList.add('manoDeObraAutocompleteList');
    div.innerHTML = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`;
    div.addEventListener('click', () => {
        inputManoObra.value = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`;
        autocompleteListManoObra.innerHTML = '';
        txtCantManoObra.disabled = false;
        divCableUtilizado.hidden = true;
        if (item && item.tipo == 'FUERA_SACRE') {
            // SI NO ES PLUSVALIA SE DESHABILITA EL CAMPO DE CANTIDAD Y SE PONE 1 POR DEFECTO
            if (item.clave_unidad != "FN24PV") {
                txtCantManoObra.value = 1;
                txtCantManoObra.disabled = true;
            }

            // SI ES RANGO DE 0 A 100 METROS EN RED SECUNDARIA SE MUESTRA EL CAMPO CABLE UTILIZADO
            if (item.clave_unidad == "N24/0-100" && slcTipoRed.value == "SEC") {
                divCableUtilizado.hidden = false;
            }
        }
    });
    autocompleteListManoObra.appendChild(div);
    
}

let agregarUC = () => {
    let txtManoObra = document.getElementById('txtManoDeObra');
    let txtCantManoObra = document.getElementById('txtCantManoObra');
    let slcTipoRed = document.getElementById('slcTipoRed');
    let alertaCable = document.getElementById('alertaCable');
    let slcCableUtilizado = document.getElementById('slcCableUtilizado');
    let divCableUtilizado = document.getElementById('divCableUtilizado');
    let slcTerminal = document.getElementById('slcTerminal');

    txtManoObra.required = true;
    txtCantManoObra.required = true;

    var form = document.getElementById("frmLum");
    if (form.checkValidity() == false) {
        form.reportValidity();
        return;
    }

    const table = document.getElementById('manoDeObraTable');

    if (txtManoObra.value == '' || txtCantManoObra.value == '' || txtManoObra.value.split(' / ').length != 3)
        return;

    let txtManoObraArray = txtManoObra.value.split(' / ')
    let clave = txtManoObraArray[0].trim();

    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i]
        if (row.cells[0].innerHTML == clave && row.cells[5].innerHTML == slcTipoRed.value && row.cells[6].innerHTML == slcTerminal.value) {
            alert('La unidad de construcción ya existe en la lista con el mismo tipo de red y terminal.');
            return;
        }
    }

    fetch('./catalogos/cat_lum.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.clave_unidad == clave) {
                    if (!validarCantidad(item, txtCantManoObra.value)) {
                        return;
                    }

                    if (item.clave_unidad == "N24/0-100" && slcTipoRed.value == "SEC" && slcCableUtilizado.value === "false") {
                        alertaCable.hidden = false;                        

                        // SI YA HABÍAN AGREGADO CABLE en material de tipo de red secundaria Y SE QUITA EL CABLE, SE ELIMINA LA FILA
                        UCTable = removeArrayUC({ array: UCTable, coincidencia: "CABLE", agrupador: "ESTRATEGICO" });
                        actualizarTabla(table, UCTable);
                    }

                    if (item.agrupador == "ESTRATEGICO" && slcTipoRed.value == "SEC" && item.descripcion.toUpperCase().includes("CABLE") && alertaCable.hidden == false) {
                        alert('No es posible agregar cables en red secundaria por que se indicó que no se utilizó cable en "N24/0-100".');
                        return;
                    }
                    UCTable.push({
                        UC_Idcumontada: item.id_cumontada,
                        UC_Cantidad: txtCantManoObra.value,
                        UC_Clave: item.clave_unidad,
                        UC_Desc: item.descripcion,
                        UC_Unidad: item.unidad,
                        UC_CableUtilizado: item.clave_unidad == "N24/0-100" && slcTipoRed.value == "SEC" ? (slcCableUtilizado.value === "true") : "",
                        UC_Tipo:item.tipo_costeo == 'MATERIALES' && item.agrupador == 'PRECONECTORIZADOS'? 'MATERIAL PRE': item.tipo_costeo == 'MATERIALES'? 'MATERIAL TRA': 'MANO DE OBRA',
                        UC_TipoRed: slcTipoRed.value,
                        UC_Agrupador: item.agrupador,
                        UC_Terminal: document.getElementById('slcTerminal').value
                    });

                    actualizarTabla(table, UCTable);

                    txtManoObra.value = '';
                    txtCantManoObra.value = '';
                    divCableUtilizado.hidden = true;
                    // console.log(UCTable);
                }
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error));
}

let actualizarTabla = (table, data) => {
    // Eliminar todas las filas de la tabla
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    // Agregar las filas actualizadas
    data.forEach(item => {
        let row = table.insertRow();
        let cellClave = row.insertCell(0);
        let cellDescripcion = row.insertCell(1);
        let cellUnidad = row.insertCell(2);
        let cellCantidad = row.insertCell(3);
        let cellTipo = row.insertCell(4);
        let cellTipoRed = row.insertCell(5);
        let cellTerminal = row.insertCell(6);
        let cellEliminar = row.insertCell(7);

        cellClave.innerHTML = item.UC_Clave;
        cellDescripcion.innerHTML = item.UC_Desc;
        cellUnidad.innerHTML = item.UC_Unidad;
        cellCantidad.innerHTML = item.UC_Cantidad;
        cellTipo.innerHTML = item.UC_Tipo; //== 'SIATEL' ? 'Materiales' : 'Mano de obra';
        cellTipoRed.innerHTML = item.UC_TipoRed;
        cellTerminal.innerHTML = item.UC_Terminal;

        let btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn');
        btnEliminar.classList.add('btn-outline-danger');
        btnEliminar.innerHTML = '<i class="fa fa-trash-o"></i>';
        btnEliminar.catalogo = item.UC_Clave;
        btnEliminar.onclick = function () {
            let row = this.parentNode.parentNode;
            row.parentNode.removeChild(row);
            UCTable = removeArrayUC({ array: UCTable, clave: item.UC_Clave, tipoRed: item.UC_TipoRed, terminal: item.UC_Terminal });
            actualizarTabla(table, UCTable);
        }
        cellEliminar.appendChild(btnEliminar);
    });
} 

let txtCantManoObra_change = (e) => {
    validaPositivos(e);
    slcTipoRed_change(e);
}

let txtCantMateriales_change = (e) => {
    validaPositivos(e);
    slcTipoRed_change(e);
}


let validaPositivos = (e) => {
    let valor = e.target.value;
    if (valor < 1) {
        e.target.value = 1;
    }
}

let sendDataToBot = () => {
    var form = document.getElementById("frmLum");

    if (UCTable.length <= 0) {
        alert('Debe agregar al menos una unidad de construcción');
        return;
    }

    // let txtFechaInicio = document.getElementById('txtFechaInicio');
    // let txtFechaFin = document.getElementById('txtFechaFin');

    // if (txtFechaInicio.value > txtFechaFin.value) {
    //     alert('La fecha de fin debe ser mayor a la fecha de inicio');
    //     return;
    // }

    document.getElementById('txtManoDeObra').required = false;
    document.getElementById('txtCantManoObra').required = false;

    if (form.checkValidity() == false) {
        form.reportValidity();
        return;
    }

    const txtDescTrabajo = document.getElementById('txtDescTrabajo');
    
    UCTable = UCTable.map(item => {
        item.UC_TipoRed = item.UC_TipoRed == "PRI"?"P":item.UC_TipoRed == "SEC"?"S":"";
        delete item.UC_Desc;
        delete item.UC_Unidad;
        delete item.UC_Tipo;
        delete item.UC_Agrupador;
        delete item.UC_Clave;
        return item;
    });

    let coordenadas = [];
    let data = {
        DescTrabajos: txtDescTrabajo.value,
        // FechaIni: txtFechaInicio.value,
        // FechaFin: txtFechaFin.value,
        Constructor_almacen: slcAlmacen.value,
        ListaUC: UCTable,
         DatosTerminales: (() => {
            // Recolectar todos los inputs de latitud (ids: txtLat_<terminal>) y obtener su lon correspondiente
            const latInputs = document.querySelectorAll('[id^="txtLat_"]');
            latInputs.forEach(latEl => {
                const terminalId = latEl.id.substring('txtLat_'.length);
                const longEl = document.getElementById(`txtLong_${terminalId}`);
                const fechaIni = document.getElementById(`fechaIni_${terminalId}`).textContent.replace('Fecha Inicio: ', '').trim();
                const fechaFin = document.getElementById(`fechaFin_${terminalId}`).textContent.replace('Fecha Fin: ', '').trim();
                coordenadas.push({
                    terminal: terminalId,
                    latitud: latEl.value || '',
                    longitud: longEl ? longEl.value || '' : '',
                    fechaIni: fechaIni,
                    fechaFin: fechaFin
                });
            });
            return coordenadas;
        })()
    }

    let jsonString = JSON.stringify(data);
    console.log(data);

    XAVApp.MainButton.showProgress();
    Telegram.WebApp.sendData(jsonString);
    XAVApp.close();
}

let chkManoObra_change = (e) => {
    document.getElementById('txtManoDeObra').value = '';
    document.getElementById('txtCantManoObra').value = '';
}

let chkMateriales_change = (e) => {
    document.getElementById('txtManoDeObra').value = '';
    document.getElementById('txtCantManoObra').value = '';
}

let chkMatPreconectorizado_change = (e) => {
    document.getElementById('txtManoDeObra').value = '';
    document.getElementById('txtCantManoObra').value = '';
}

// let chkMatPreconectorizado_change = (e) => {
//     validaPositivos(e);
//     slcTipoRed_change(e);
// }


let removeArrayUC = ({ array, clave = "", coincidencia = "", agrupador = "",tipoRed="", terminal="" }) => {

    // Eliminar elementos que coincidan con la clave y el tipo de red
    if (clave !== "" && tipoRed !== "" && terminal !== "") {
        console.log(clave,  slcTipoRed.value, terminal);
        array = array.filter(item => item.UC_Clave !== clave || item.UC_TipoRed !== tipoRed || item.UC_Terminal !== terminal);
        // Validar si se debe ocultar la alerta de cable
        if (!array.some(item => item.UC_Clave === "N24/0-100" && item.UC_TipoRed === "SEC")) {
            alertaCable.hidden = true;
            console.log("alertaCable", alertaCable.hidden);

        }
    }

    // Eliminar elementos que coincidan con la coincidencia y el agrupador
    if (coincidencia !== "" && agrupador !== "") {
        array = array.filter(item => 
            !item.UC_Desc.toUpperCase().includes(coincidencia.toUpperCase()) || 
            item.UC_Agrupador.toUpperCase() !== agrupador.toUpperCase()
        );
    }
    return array;
}

let validarCantidad = (item, cantidad) => {
    let msg = "";
    switch (item.tipo) {
        case 'SIATEL':

            break;
        case 'FUERA_SACRE':
            if (item.clave_unidad == "FN24PV" && (cantidad > 9 || cantidad < 1)) { // 1 a 13 fusiones
                msg = "Para " + `${item.clave_unidad}` + "\nSólo se permite capturar la cantidad de 1 a 9, intenta nuevamente.";
                alert(msg);
                return false;
            }

            if(slcTipoRed.value == 'SEC'){
                if (item.clave_unidad != "FN24PV") { // 1 a 13 fusiones
                    cantidad = 1;
                    txtCantManoObra.enabled = false;
                    return true;
                }
            }
        break;
    }
    return true;
}

let slcTipoRed_change = (e) => {
    const inputManoObra = document.getElementById('txtManoDeObra');
    const autocompleteListManoObra = document.getElementById('manoDeObraAutocompleteList');

    fetch('./catalogos/cat_lum.json')
    .then(response => response.json())
    .then(data => {
        inputManoObra.addEventListener('input', () => {
            const value = inputManoObra.value.toLowerCase();
            autocompleteListManoObra.innerHTML = '';
            // let tipoRed = ''
            // switch (slcTipoRed.value) {
            //     case 'SEC_H':
            //         tipoRed = 'PRECONECTORIZADO_HUAWEI';
            //         break;
            //     case 'SEC_Z':
            //         tipoRed = 'PRECONECTORIZADO_ZTE';
            //         break;
            //     case 'SEC_F':
            //         tipoRed = 'PRECONECTORIZADO_FIBERHOME';
            //         break;  
            // }

            if (!value) {
                return false;
            }

            data.forEach(item => {

                //check mano de obra == true, tipo: sacre y si constructor es Enlace Digital tipo:Fuera de sacre
                //check materiales == true, tipo: siatel
                if (chkManoObra.checked) {
                    if (item.tipo == 'FUERA_SACRE') {
                        if (item.clave_unidad.toLowerCase().includes(value)) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        } else if (item.descripcion.toLowerCase().includes(value)) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        }
                    }
                } else if (chkMateriales.checked) {
                    if (item.tipo == 'SIATEL' && item.agrupador != 'PRECONECTORIZADOS') {
                        if (item.clave_unidad.toLowerCase().includes(value)) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        } else if (item.descripcion.toLowerCase().includes(value)) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        }
                    }
                }  else if (chkMatPreconectorizado.checked ) {
                    if (item.tipo == 'SIATEL' && item.agrupador == 'PRECONECTORIZADOS') {
                        if ((item.clave_unidad.toLowerCase().includes(value))) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        } else if (item.descripcion.toLowerCase().includes(value)) {
                            insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                        }
                    }
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (e.target !== inputManoObra) {
                autocompleteListManoObra.innerHTML = '';
            }
        });
    })
    .catch(error => console.error('Error fetching the JSON:', error));

    const divCableUtilizado = document.getElementById('divCableUtilizado');
    const txtManoObra = document.getElementById('txtManoDeObra');
    if (e.target.value == "SEC" && txtManoObra.value.includes("N24/0-100")) {
        divCableUtilizado.hidden = false;
    } else {
        divCableUtilizado.hidden = true;
    }
}
