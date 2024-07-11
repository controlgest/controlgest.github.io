let UCTable = []
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

$(document).ready(() => {

    document.getElementById('frmLum').addEventListener('submit', function (event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario al enviarse

        // Lógica de envío de formulario aquí
        console.log('Formulario enviado sin borrar datos de la tabla.');
    });

    const autocompleteListManoObra = document.getElementById('manoDeObraAutocompleteList');
    const inputManoObra = document.getElementById('txtManoDeObra');
    const txtFolio = document.getElementById('txtFolio')
    const txtArea = document.getElementById('txtArea')
    const txtCope = document.getElementById('txtCope')
    const chkManoObra = document.getElementById('chkManoObra')
    const slcTipoLum = document.getElementById('slcTipoLum')
    const tXtDescDanios = document.getElementById('tXtDescDanios')
    const tXtDescTrabajo = document.getElementById('tXtDescTrabajo')

    // Tomar parámetros de la URL
    let url = new URLSearchParams(document.location.search);
    let folio = url.get("pFolio");
    let area = url.get("pArea");
    let cope = url.get("pCope");
    let idConstructor = url.get("pConst");
    chkManoObra.checked = true

    if (folio != null)
        txtFolio.textContent = folio.toUpperCase()
    if (area != null)
        txtArea.textContent = area.toUpperCase()
    if (cope != null)
        txtCope.textContent = cope.toUpperCase()
    if (constructor != null) {
        fetch('./catalogos/catConstructores.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    if (item.id_cconstructor == idConstructor) {
                        txtConstructor.textContent = item.constructor
                    }
                });
            })
    }

    chkManoObra.ariaChecked = true
    let idsFueraSacre = [9,11]
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
                        if (item.tipo == 'SACRE' && !idsFueraSacre.find(x =>x == idConstructor)) {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            } else if (item.descripcion.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            }
                        } else if (item.tipo == 'FUERA_SACRE' && idsFueraSacre.find(x =>x == idConstructor)) {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            } else if (item.descripcion.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            }
                        }
                    } else if (!chkManoObra.checked) {
                        if (item.tipo == 'SIATEL' && !idsFueraSacre.find(x =>x == idConstructor)) {
                            if (item.clave_unidad.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            } else if (item.descripcion.toLowerCase().includes(value)) {
                                insertItemManoDeObraAutocompleteList(item)
                            }
                        }
                    }
                }
                );
            }
            );

            document.addEventListener('click', (e) => {
                if (e.target !== inputManoObra) {
                    autocompleteListManoObra.innerHTML = '';
                }
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error));

    let insertItemManoDeObraAutocompleteList = (item) => {
        const div = document.createElement('div');
        div.classList.add('manoDeObraAutocompleteList');
        div.innerHTML = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`;
        div.addEventListener('click', () => {
            inputManoObra.value = `${item.clave_unidad} / ${item.descripcion} / ${item.unidad}`
            autocompleteListManoObra.innerHTML = '';
        }
        );
        autocompleteListManoObra.appendChild(div);
    }

});

let agregarManoObra = () => {
    const table = document.getElementById('manoDeObraTable')
    let txtManoObra = document.getElementById('txtManoDeObra').value
    let txtCantManoObra = document.getElementById('txtCantManoObra').value

    if (txtManoObra == '' || txtCantManoObra == '' || txtManoObra.split(' / ').length != 3) {
        return
    }

    let txtManoObraArray = txtManoObra.split(' / ')
    let clave = txtManoObraArray[0].trim()

    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i]
        if (row.cells[0].innerHTML == clave) {
            alert('La unidad de construcción ya existe en la lista')
            return
        }
    }

    fetch(
        './catalogos/cat_lum.json'
    )
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.clave_unidad == clave) {
                    let row = table.insertRow(0)
                    let cellClave = row.insertCell(0)
                    let cellDescripcion = row.insertCell(1)
                    let cellUnidad = row.insertCell(2)
                    let cellCantidad = row.insertCell(3)
                    let cellTipo = row.insertCell(4)
                    let cellEliminar = row.insertCell(5)

                    cellClave.innerHTML = item.clave_unidad
                    cellDescripcion.innerHTML = item.descripcion
                    cellUnidad.innerHTML = item.unidad
                    cellTipo.innerHTML = item.tipo == 'SIATEL' ? 'Materiales' : 'Mano de obra'
                    cellCantidad.innerHTML = txtCantManoObra

                    UCTable.push(
                        {
                            idUC: item.id_cumontada,
                            claveUC: item.clave_unidad,
                            descUC: item.descripcion,
                            idUnidad: item.id_cunidad,
                            tipo: item.tipo,
                            unidad: item.unidad,
                            cantidad: cellCantidad.textContent
                        }
                    )

                    let btnEliminar = document.createElement('button')
                    btnEliminar.classList.add('btn')
                    btnEliminar.classList.add('btn-outline-danger')
                    btnEliminar.innerHTML = '<i class="fa fa-trash-o"></i>'
                    btnEliminar.onclick = function () {
                        let row = this.parentNode.parentNode
                        row.parentNode.removeChild(row)
                    }
                    cellEliminar.appendChild(btnEliminar)
                }
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error))

}

let txtCantManoObra_change = (e) => {
    validaPositivos(e)
}

let txtCantMateriales_change = (e) => {
    validaPositivos(e)
}

let validaPositivos = (e) => {
    let valor = e.target.value;
    if (valor < 1) {
        e.target.value = 1;
    }
}

XAVApp.MainButton.onClick(() => {
    XAVApp.MainButton.showProgress();
    enviarLum();
})

let enviarLum = (e) => {
    //e.preventDefault();

    let form = document.getElementById('frmLum');
    if (form.checkValidity()) {
        if (UCTable.length <= 0) {
            alert('Debe agregar al menos una unidad de construcción')
            return
        }

        let lum = {
            tipo: slcTipoLum.value,
            descDaños: tXtDescDanios.value,
            descTrabajos: tXtDescTrabajo.value,
            UC: UCTable
        }
        console.log(lum);

        Telegram.WebApp.sendData(lum);
        XAVApp.close();
    } else {
        form.reportValidity()
    }
}



let chkManoObra_change = (e) => {
    document.getElementById('txtManoDeObra').value = ''

}

let chkMateriales_change = (e) => {
    document.getElementById('txtManoDeObra').value = ''
}
