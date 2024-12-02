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

let cargarDatos = (params) => {
    const txtTipoLum = document.getElementById('txtTipoLum');
    const inputManoObra = document.getElementById('txtManoDeObra');
    const autocompleteListManoObra = document.getElementById('manoDeObraAutocompleteList');
    const txtFolio = document.getElementById('txtFolio');
    const txtArea = document.getElementById('txtArea');
    const txtCope = document.getElementById('txtCope');
    const chkManoObra = document.getElementById('chkManoObra');

    let folio = params.get("pFolio");
    let area = params.get("pArea");
    let cope = params.get("pCope");
    let idConstructor = params.get("pConst");
    let tipoLUM = params.get("pTipoLum");
    let constructorSacre = params.get("pSacre");

    txtTipoLum.textContent = tipoLUM.toUpperCase();
    chkManoObra.checked = true;
    txtFolio.textContent = folio.toUpperCase();
    txtArea.textContent = area.toUpperCase();
    txtCope.textContent = cope.toUpperCase();

    if (constructor != null) {
        fetch('./catalogos/catConstructores.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    if (item.id_cconstructor == idConstructor) {
                        txtConstructor.textContent = item.constructor;
                    }
                });
            });
    }

    chkManoObra.ariaChecked = true;

    fetch('./catalogos/cat_lum.json')
        .then(response => response.json())
        .then(data => {
            inputManoObra.addEventListener('input', () => {
                const value = inputManoObra.value.toLowerCase();
                autocompleteListManoObra.innerHTML = '';

                if (!value) {
                    return false;
                }

                data.forEach(item => {

                    //check mano de obra == true, tipo: sacre y si constructor es Enlace Digital tipo:Fuera de sacre
                    //check materiales == true, tipo: siatel
                    if (chkManoObra.checked) {
                        if (item.tipo == 'SACRE' && constructorSacre == "True") {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                            } else if (item.descripcion.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                            }
                        } else if (item.tipo == 'FUERA_SACRE' && constructorSacre == "False") {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                            } else if (item.descripcion.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(autocompleteListManoObra, inputManoObra, item);
                            }
                        }
                    } else if (!chkManoObra.checked) {
                        if (item.tipo == 'SIATEL') {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
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
}

let insertItemManoDeObraAutocompleteList = (autocompleteListManoObra, inputManoObra, item) => {

    const div = document.createElement('div');
    div.classList.add('manoDeObraAutocompleteList');
    div.innerHTML = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`;
    div.addEventListener('click', () => {
        inputManoObra.value = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`;
        autocompleteListManoObra.innerHTML = '';
    }
    );
    autocompleteListManoObra.appendChild(div);
}

let validarCantidad = (item, cantidad) => {
    let msg = "";

    if (item.clave_unidad.includes("FCEFP5") && !(cantidad >= 1 && cantidad <= 13)) { // 1 a 13 fusiones
        txtCantManoObra.value == ''
        msg = "Para " + `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}` + "\nSólo se permite capturar la cantidad de 1 a 13 fusiones, intenta nuevamente.";
        alert(msg);
        return false;
    } else if (item.clave_unidad.includes("FCEFP6") && !(cantidad >= 14 && cantidad <= 50)) { // 14 a 50 fusiones
        txtCantManoObra.value == ''
        msg = "Para " + `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}` + "\nSólo se permite capturar la cantidad de 14 a 50 fusiones, intenta nuevamente.";
        alert(msg);
        return false;
    } else if (item.clave_unidad.includes("FCEFP7") && !(cantidad >= 51)) { // > 51 fusiones
        txtCantManoObra.value == ''
        msg = "Para " + `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}` + "\nSólo se permite capturar la cantidad de 51 fusiones en adelante, intenta nuevamente.";
        alert(msg);
        return false;
    }

    return true;
}

let agregarUC = () => {
    let txtManoObra = document.getElementById('txtManoDeObra');
    let txtCantManoObra = document.getElementById('txtCantManoObra');

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
        if (row.cells[0].innerHTML == clave) {
            alert('La unidad de construcción ya existe en la lista');
            return;
        }
    }

    fetch(
        './catalogos/cat_lum.json'
    )
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.clave_unidad == clave) {
                    if (!validarCantidad(item, txtCantManoObra.value)) {
                        return
                    }
                    let row = table.insertRow(0);
                    let cellClave = row.insertCell(0);
                    let cellDescripcion = row.insertCell(1);
                    let cellUnidad = row.insertCell(2);
                    let cellCantidad = row.insertCell(3);
                    let cellTipo = row.insertCell(4);
                    let cellJornada = row.insertCell(5)
                    let cellEliminar = row.insertCell(6);

                    cellClave.innerHTML = item.clave_unidad;
                    cellDescripcion.innerHTML = item.descripcion;
                    cellUnidad.innerHTML = item.unidad;
                    cellTipo.innerHTML = item.tipo == 'SIATEL' ? 'Materiales' : 'Mano de obra';
                    cellCantidad.innerHTML = txtCantManoObra.value;
                    cellJornada.innerHTML = item.tipo == 'SIATEL'?'':$("#slcJornada option:selected").text();

                    UCTable.push(
                        {
                            UC_Idcumontada: item.id_cumontada,
                            UC_Cantidad: cellCantidad.textContent,
                            UC_Clave: item.clave_unidad,
                            UC_Unidad: item.unidad,
                            UC_Desc: '',//item.descripcion,
                            //idUnidad: item.id_cunidad, no se requiere
                            UC_Tipo: item.tipo,
                            UC_Jornada:item.tipo == 'SIATEL'?'':slcJornada.value
                        }
                    )

                    let btnEliminar = document.createElement('button');
                    btnEliminar.classList.add('btn');
                    btnEliminar.classList.add('btn-outline-danger');
                    btnEliminar.innerHTML = '<i class="fa fa-trash-o"></i>';
                    btnEliminar.catalogo = item.clave_unidad;
                    btnEliminar.onclick = function () {
                        let row = this.parentNode.parentNode;
                        row.parentNode.removeChild(row);
                        UCTable = removeArrayUC(UCTable, this.catalogo);
                    }
                    cellEliminar.appendChild(btnEliminar);
                    document.getElementById('txtManoDeObra').value = '';
                    document.getElementById('txtCantManoObra').value = '';
                }
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error))
}

let txtCantManoObra_change = (e) => {
    validaPositivos(e);
}

let txtCantMateriales_change = (e) => {
    validaPositivos(e);
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

    let txtFechaInicio = document.getElementById('txtFechaInicio');
    let txtFechaFin = document.getElementById('txtFechaFin');

    if (txtFechaInicio.value > txtFechaFin.value) {
        alert('La fecha de fin debe ser mayor a la fecha de inicio');
        return;
    }

    document.getElementById('txtManoDeObra').required = false;
    document.getElementById('txtCantManoObra').required = false;

    if (form.checkValidity() == false) {
        form.reportValidity();
        return;
    }

    const txtDescDanios = document.getElementById('txtDescDanios');
    const txtDescTrabajo = document.getElementById('txtDescTrabajo');

    let data = {
        LumDescDanios: txtDescDanios.value,
        LumDescTrabajos: txtDescTrabajo.value,
        LumFechaIni:txtFechaInicio.value,
        LumFechaFin:txtFechaFin.value,
        ListaUC: UCTable
    }
    let jsonString = JSON.stringify(data);
    //  console.log(data);   

    XAVApp.MainButton.showProgress();
    Telegram.WebApp.sendData(jsonString);
    XAVApp.close();
}

let chkManoObra_change = (e) => {
    document.getElementById('txtManoDeObra').value = '';
    document.getElementById('txtCantManoObra').value = '';
    let slcJornada = document.getElementById('slcJornada');
    slcJornada.disabled = false;
}

let chkMateriales_change = (e) => {
    document.getElementById('txtManoDeObra').value = '';
    document.getElementById('txtCantManoObra').value = '';
    let slcJornada = document.getElementById('slcJornada');

    slcJornada.disabled = true;
    slcJornada.value = 'NOR';
}

let removeArrayUC = (array, obj) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i].UC_Clave === obj)
            array.splice(i, 1);
    }
    return array;
}