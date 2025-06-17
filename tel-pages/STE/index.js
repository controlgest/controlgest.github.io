// window.Telegram.WebApp.ready(); 
// window.Telegram.WebApp.expand(); 
// initData is empty object 
// let initData = window.Telegram.WebApp.initData; 
// initDataUnsafe is empty object,too 
// let initDataUnsafe = window.Telegram.WebApp.initDataUnsafe; 
// window.Telegram.WebApp.MainButton.showProgress() 
// window.Telegram.WebApp.MainButton.setText('submit').show().enable() 
// window.Telegram.WebApp.MainButton.isProgressVisible = "true" 
// This Event is not working, Why? 
// window.Telegram.WebApp.MainButton.onClick(() => {alert('submitted')}); 

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
    // expand() { 
    // 	Telegram.WebApp.expand(); 
    // }, 
    close() {
        Telegram.WebApp.close();
    }
}

XAVApp.init();

$(document).ready( async function () {
    const params = new URLSearchParams(document.location.search);
    
    if (params.size > 0) {
        await cargarSlcTipoAsignacion(params);
        await cargarEmpleados(params);
    }


});


XAVApp.MainButton.onClick(() => {
    let form = document.getElementById("myForm");
    if (form.checkValidity() == false) {
        form.reportValidity();
        return;
    }
    else {
        XAVApp.MainButton.showProgress();
        sendDataToBot();
    }
});

function sendDataToBot() {
    let form = document.getElementById("myForm");
    if (form.checkValidity() == false)
        return;
    let json = getJsonData();
    Telegram.WebApp.sendData(json);
    XAVApp.close();
}

function getJsonData() {
    let map = new Map();
    let pnlEmpleados = document.getElementById("pnlEmpleados");

    $(pnlEmpleados).find('input, select') //find('input:text, input:password, input:file, select, textarea') 
        .each(function () {
            let el = $(this);
            map.set(el[0].id, el[0].value);

        });
    // for (let element of map) { 
    //   console.log(element); 
    // } 
    let data = [];
    let datos = '';
    for (let [key, value] of map) {
        //    console.log(key + " - " + value); 
        if (key.indexOf('Fecha') > 0) {
            let fecha = value != '' ? value : '';
            datos += '"' + key + '": "' + fecha + '",';
        }
        else {
            value = value != '' ? value : 0
            datos += '"' + key + '": ' + value + ',';
        }

        if (key.indexOf('TotalHoras') > 0) {
            datos = '{' + datos.substring(0, datos.length - 1) + '}';
            let jsonParse = JSON.parse(datos);
            data.push(jsonParse);
            datos = '';
        }
    }
     //console.log(data);

    //let json = JSON.stringify(Object.fromEntries(map)); 
    let json = JSON.stringify(data);
    return json;
}

function validarExpediente(me) {
    let numEmpleado = me.id.split('_')[1];
    let expediente = Number(me.value);
    me.value = expediente;

    if (expediente <= 0 || !Number.isInteger(expediente)) {
        me.value = '';
        return;
    }

    for (let i = 1; i <= 15; i++) {
        if (i == numEmpleado) continue;
        let txtExp = document.getElementById('txtExpediente_' + i);
        let slcAsig = document.getElementById('slcAsignacion_' + i);
        let slcAsigActual = document.getElementById('slcAsignacion_' + numEmpleado);
        if (txtExp.value == '' ) continue;

        if (
            txtExp && slcAsig && slcAsigActual &&
            txtExp.value == expediente &&
            slcAsig.value != '0' &&
            slcAsig.value == slcAsigActual.value
        ) {
            alert('El expediente ya se encuentra registrado para la asignación: ' + slcAsig.options[slcAsig.selectedIndex].text + ', favor de verificar.');
            me.value = '';
            break;
        }

        //validar fechas
        validateRange(document.getElementById('txtFechaFin_' + numEmpleado));
    
    }
}

function validateRange(me) {
    //console.log(me.id + ' ' + me.value);
    let num = (me.id).split('_')[1];    
    let txtTotalHoras = $('#txtTotalHoras' + num);
    let txt1 = $('#txtFechaIni_' + num);
    let txt2 = $('#txtFechaFin_' + num);

    txtTotalHoras.val('');
    if (isNaN(Date.parse(me.value))) {
        me.value = "";
        return;
    }

    if (txt1.val() == '' || txt2.val() == '')
        return;
    let fechaIni = new Date(txt1.val());
    let fechaFin = new Date(txt2.val());
    

    if (fechaIni >= fechaFin) {
        alert('Fechas no válidas, favor de verificar.');
        return;
    }

    for (let i = 1; i <= 15; i++) {
    if (i == num) continue;
    let txtFIni = $('#txtFechaIni_' + i);
    let txtFFin = $('#txtFechaFin_' + i);
    let txtExpediente = $('#txtExpediente_' + i);

    // Solo validar si el expediente es el mismo
    if (
        txtFIni.val() != '' &&
        txtFFin.val() != '' &&
        txtExpediente.val() != '' &&
        txtExpediente.val() == $('#txtExpediente_' + num).val()
    ) {
        let fechaIni2 = new Date(txtFIni.val());
        let fechaFin2 = new Date(txtFFin.val());

        if (fechaIni < fechaFin2 && fechaFin > fechaIni2) {
            alert('El empleado con expediente: ' + txtExpediente.val() + ' ya tiene asignación en el rango de fechas seleccionado, favor de verificar.');
            //limpiar campos
            me.value = '';
            txt1.val('');
            txt2.val('');
            return;
        }
    }
}

    // segundos = milisegundos/1000
    // minutos = segundos/60
    // horas = minutos/60
    // Días = horas/24

    const diffInDays = Math.floor((fechaFin - fechaIni) / (1000 * 60 * 60 * 24));
    const diffInHoras = ((fechaFin - fechaIni) / (1000 * 60 * 60)).toFixed(2);
    const diffInMinutos = Math.floor((fechaFin - fechaIni) / (1000 * 60));
    // console.log('Días: ' + diffInDays + ' Horas: ' + diffInHoras + ' Minutos: ' + diffInMinutos);

    txtTotalHoras.val(diffInHoras);
}

function agregarEmpleado() {
    let pnl2 = $('#pnlEmpleado2');
    let pnl3 = $('#pnlEmpleado3');
    let pnl4 = $('#pnlEmpleado4');
    let pnl5 = $('#pnlEmpleado5');
    let pnl6 = $('#pnlEmpleado6');
    let pnl7 = $('#pnlEmpleado7');
    let pnl8 = $('#pnlEmpleado8');
    let pnl9 = $('#pnlEmpleado9');
    let pnl10 = $('#pnlEmpleado10');
    let pnl11 = $('#pnlEmpleado11');
    let pnl12 = $('#pnlEmpleado12');
    let pnl13 = $('#pnlEmpleado13');
    let pnl14 = $('#pnlEmpleado14');
    let pnl15 = $('#pnlEmpleado15');

    if (pnl2.is(":visible") == false) {
        pnl2.show(500);
        $('#txtExpediente_2').attr("required", "");
        $('#txtFechaIni_2').attr("required", "");
        $('#txtFechaFin_2').attr("required", "");
    }
    else if (pnl3.is(":visible") == false) {
        pnl3.show(500);
        $('#txtExpediente_3').attr("required", "");
        $('#txtFechaIni_3').attr("required", "");
        $('#txtFechaFin_3').attr("required", "");
    }
    else if (pnl4.is(":visible") == false) {
        pnl4.show(500);
        $('#txtExpediente_4').attr("required", "");
        $('#txtFechaIni_4').attr("required", "");
        $('#txtFechaFin_4').attr("required", "");
    }
    else if (pnl5.is(":visible") == false) {
        pnl5.show(500);
        $('#txtExpediente_5').attr("required", "");
        $('#txtFechaIni_5').attr("required", "");
        $('#txtFechaFin_5').attr("required", "");
    }
    else if (pnl6.is(":visible") == false) {
        pnl6.show(500);
        $('#txtExpediente_6').attr("required", "");
        $('#txtFechaIni_6').attr("required", "");
        $('#txtFechaFin_6').attr("required", "");
    }
    else if (pnl7.is(":visible") == false) {
        pnl7.show(500);
        $('#txtExpediente_7').attr("required", "");
        $('#txtFechaIni_7').attr("required", "");
        $('#txtFechaFin_7').attr("required", "");
    }
    else if (pnl8.is(":visible") == false) {
        pnl8.show(500);
        $('#txtExpediente_8').attr("required", "");
        $('#txtFechaIni_8').attr("required", "");
        $('#txtFechaFin_8').attr("required", "");
    }
    else if (pnl9.is(":visible") == false) {
        pnl9.show(500);
        $('#txtExpediente_9').attr("required", "");
        $('#txtFechaIni_9').attr("required", "");
        $('#txtFechaFin_9').attr("required", "");
    }
    else if (pnl10.is(":visible") == false) {
        pnl10.show(500);
        $('#txtExpediente_10').attr("required", "");
        $('#txtFechaIni_10').attr("required", "");
        $('#txtFechaFin_10').attr("required", "");
    }
    else  if (pnl11.is(":visible") == false) {
        pnl11.show(500);
        $('#txtExpediente_11').attr("required", "");
        $('#txtFechaIni_11').attr("required", "");
        $('#txtFechaFin_11').attr("required", "");
    }
    else  if (pnl12.is(":visible") == false) {
        pnl12.show(500);
        $('#txtExpediente_12').attr("required", "");
        $('#txtFechaIni_12').attr("required", "");
        $('#txtFechaFin_12').attr("required", "");
    }
    else  if (pnl13.is(":visible") == false) {
        pnl13.show(500);
        $('#txtExpediente_13').attr("required", "");
        $('#txtFechaIni_13').attr("required", "");
        $('#txtFechaFin_13').attr("required", "");
    }
    else  if (pnl14.is(":visible") == false) {
        pnl14.show(500);
        $('#txtExpediente_14').attr("required", "");
        $('#txtFechaIni_14').attr("required", "");
        $('#txtFechaFin_14').attr("required", "");
    }
    else  if (pnl15.is(":visible") == false) {
        pnl15.show(500);
        $('#txtExpediente_15').attr("required", "");
        $('#txtFechaIni_15').attr("required", "");
        $('#txtFechaFin_15').attr("required", "");
    }
    else
    {
        alert('No se pueden agregagar mas empleados. El límite es de 15.\nPara agregar más debe realizar una captura adicional de Tiempo Extra.');
    }

}

function eliminarEmpleado(posicion) {
    let pnl = $('#pnlEmpleado' + posicion);
    let txtExp = $('#txtExpediente_' + posicion);
    let txtFIni = $('#txtFechaIni_' + posicion);
    let txtFFin = $('#txtFechaFin_' + posicion);
    let txtHrs = $('#txtTotalHoras' + posicion);

    pnl.hide(500);
    txtExp.val('');
    txtExp.removeAttr("required");
    txtFIni.val('');
    txtFIni.removeAttr("required");
    txtFFin.val('');
    txtFFin.removeAttr("required");
    txtHrs.val('');
}

 function cargarEmpleados(params) {
     let motivoTE = params.get('pMotivo');
     
    for (const p of params) {
        //e1=1914823|{fechaIni}|{fechaFin}|{emp.Emp_total_horas}
        if (p[0] != "pMotivo") {
        
            let posicion = p[0].replace(/^\D+/g, '');
            let values = p[1].split('|');
            let pnl = $('#pnlEmpleado' + posicion);
            pnl.show(1000);
            let txtExp = $('#txtExpediente_' + posicion);
            let txtFIni = $('#txtFechaIni_' + posicion);
            let txtFFin = $('#txtFechaFin_' + posicion);
            let txtHrs = $('#txtTotalHoras' + posicion);
            let divAsignacion = $('#divAsignacion' + posicion);
            txtExp.attr("required", "");
            txtExp.val(values[0]);
            txtFIni.attr("required", "");
            txtFIni.val(values[1]);
            txtFFin.attr("required", "");
            txtFFin.val(values[2]);
            txtHrs.val(values[3]);


            if (motivoTE != 3) {
                //ocultar Tipo de asignación si el tipo no es Siniestro 
                divAsignacion.css("display", "none");
            }
            else {        
                divAsignacion.css("display", "block");
                let slcAsignacion_ = $('#slcAsignacion_' + posicion);
                slcAsignacion_.val(values[4]);                 
            }
        }

    }

}

let  cargarSlcTipoAsignacion = async (params) => {
    
    let motivo = params.get("pMotivo");
    

    let select1 = $('#slcAsignacion_1');
    let select2 = $('#slcAsignacion_2');
    let select3 = $('#slcAsignacion_3');
    let select4 = $('#slcAsignacion_4');
    let select5 = $('#slcAsignacion_5');
    let select6 = $('#slcAsignacion_6');
    let select7 = $('#slcAsignacion_7');
    let select8 = $('#slcAsignacion_8');
    let select9 = $('#slcAsignacion_9');
    let select10 = $('#slcAsignacion_10');
    let select11 = $('#slcAsignacion_11');
    let select12 = $('#slcAsignacion_12');
    let select13 = $('#slcAsignacion_13');
    let select14 = $('#slcAsignacion_14');
    let select15 = $('#slcAsignacion_15');

    if (motivo != 3) { //SOLO SE MUESTRA ASIGNACIONES PARA SINIESTROS
        await $('#divAsignacion1').css("display", "none");
        await $('#divAsignacion2').css("display", "none");
        await $('#divAsignacion3').css("display", "none");
        await $('#divAsignacion4').css("display", "none");
        await $('#divAsignacion5').css("display", "none");
        await $('#divAsignacion6').css("display", "none");
        await $('#divAsignacion7').css("display", "none");
        await $('#divAsignacion8').css("display", "none");
        await $('#divAsignacion9').css("display", "none");
        await $('#divAsignacion10').css("display", "none");
        await $('#divAsignacion11').css("display", "none");
        await $('#divAsignacion12').css("display", "none");
        await $('#divAsignacion13').css("display", "none");
        await $('#divAsignacion14').css("display", "none");
        await $('#divAsignacion15').css("display", "none");
    }
    else {

        await fetch('./Catalogos/Asignaciones.json')
            .then(response => response.json())
            .then(async data => {
                await data.forEach(item => {
                    switch (item.asg_motivo_id) {
                        case 3:
                            select1.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select2.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select3.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select4.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select5.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select6.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select7.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select8.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select9.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select10.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select11.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select12.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select13.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select14.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            select15.append($('<option>', {
                                value: item.asg_id,
                                text: item.asg_tipo
                            }));
                            break;
                    }
                });
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

}

function validarAsignacion(me) {
    let num = me.id.split('_')[1];
    let asignacionActual = me.value;
    let expedienteActual = document.getElementById('txtExpediente_' + num).value;

    for (let i = 1; i <= 15; i++) {
        if (i == num) continue;
        let slcAsignacion = document.getElementById('slcAsignacion_' + i);
        let txtExpediente = document.getElementById('txtExpediente_' + i);

        if (
            slcAsignacion && txtExpediente &&
            slcAsignacion.value == asignacionActual &&
            txtExpediente.value == expedienteActual &&
            asignacionActual !== ''
        ) {
            alert('La asignación ya se encuentra registrada para el mismo expediente, favor de verificar.');
            me.value = '';
            break;
        }
    }
}