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

$(document).ready(function () {
    const params = new URLSearchParams(document.location.search);
    if (params.size > 0) {
        cargarEmpleados(params);
    }

    let motivo = params.get("pMotivo");
    console.log('motivo: ' + motivo);

    let select1 = $('#slcAsignacion1');
    let select2 = $('#slcAsignacion2');
    let select3 = $('#slcAsignacion3');
    let select4 = $('#slcAsignacion4');
    let select5 = $('#slcAsignacion5');
    let select6 = $('#slcAsignacion6');
    let select7 = $('#slcAsignacion7');
    let select8 = $('#slcAsignacion8');
    let select9 = $('#slcAsignacion9');
    let select10 = $('#slcAsignacion10');
    let select11 = $('#slcAsignacion11');
    let select12 = $('#slcAsignacion12');
    let select13 = $('#slcAsignacion13');
    let select14 = $('#slcAsignacion14');
    let select15 = $('#slcAsignacion15');

    if (motivo != 3) {
        $('#divAsignacion1').css("display", "none");
        $('#divAsignacion2').css("display", "none");
        $('#divAsignacion3').css("display", "none");
        $('#divAsignacion4').css("display", "none");
        $('#divAsignacion5').css("display", "none");
        $('#divAsignacion6').css("display", "none");
        $('#divAsignacion7').css("display", "none");
        $('#divAsignacion8').css("display", "none");
        $('#divAsignacion9').css("display", "none");
        $('#divAsignacion10').css("display", "none");
        $('#divAsignacion11').css("display", "none");
        $('#divAsignacion12').css("display", "none");
        $('#divAsignacion13').css("display", "none");
        $('#divAsignacion14').css("display", "none");
        $('#divAsignacion15').css("display", "none");
    }
    else {

        fetch('./Catalogos/Asignaciones.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
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
    //console.log(me.id + ' ' + me.value);
    let value = me.value * 1;
    me.value = value;
    if (value <= 0 || Number.isInteger(value) == false) {
        me.value = '';
        return;
    }

    let pnlEmpleados = document.getElementById("pnlEmpleados");
    $(pnlEmpleados).find('input') //find('input:text, input:password, input:file, select, textarea') 
        .each(function () {
            let el = $(this);
            if (me.id != el[0].id && el[0].id.indexOf('Expediente') > 0) {
                let _value = el[0].value * 1;
                if (_value == value)
                    me.value = '';
            }

        });
}

function validateRange(me) {
    //console.log(me.id + ' ' + me.value);
    let num = (me.id).substring((me.id).length - 1);
    let txtTotalHoras = $('#txtTotalHoras' + num);
    txtTotalHoras.val('');
    if (isNaN(Date.parse(me.value))) {
        me.value = "";
        return;
    }


    let txt1 = $('#txtFechaIni' + num);
    let txt2 = $('#txtFechaFin' + num);

    if (txt1.val() == '' || txt2.val() == '')
        return;
    let fechaIni = new Date(txt1.val());
    let fechaFin = new Date(txt2.val());

    if (fechaIni >= fechaFin) {
        alert('Fechas no válidas, favor de verificar.');
        return;
    }

    // segundos = milisegundos/1000
    // minutos = segundos/60
    // horas = minutos/60
    // Días = horas/24

    const diffInDays = Math.floor((fechaFin - fechaIni) / (1000 * 60 * 60 * 24));
    const diffInHoras = ((fechaFin - fechaIni) / (1000 * 60 * 60)).toFixed(2);
    const diffInMinutos = Math.floor((fechaFin - fechaIni) / (1000 * 60));
    console.log('Días: ' + diffInDays + ' Horas: ' + diffInHoras + ' Minutos: ' + diffInMinutos);

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
        $('#txtExpediente2').attr("required", "");
        $('#txtFechaIni2').attr("required", "");
        $('#txtFechaFin2').attr("required", "");
    }
    else if (pnl3.is(":visible") == false) {
        pnl3.show(500);
        $('#txtExpediente3').attr("required", "");
        $('#txtFechaIni3').attr("required", "");
        $('#txtFechaFin3').attr("required", "");
    }
    else if (pnl4.is(":visible") == false) {
        pnl4.show(500);
        $('#txtExpediente4').attr("required", "");
        $('#txtFechaIni4').attr("required", "");
        $('#txtFechaFin4').attr("required", "");
    }
    else if (pnl5.is(":visible") == false) {
        pnl5.show(500);
        $('#txtExpediente5').attr("required", "");
        $('#txtFechaIni5').attr("required", "");
        $('#txtFechaFin5').attr("required", "");
    }
    else if (pnl6.is(":visible") == false) {
        pnl6.show(500);
        $('#txtExpediente6').attr("required", "");
        $('#txtFechaIni6').attr("required", "");
        $('#txtFechaFin6').attr("required", "");
    }
    else if (pnl7.is(":visible") == false) {
        pnl7.show(500);
        $('#txtExpediente7').attr("required", "");
        $('#txtFechaIni7').attr("required", "");
        $('#txtFechaFin7').attr("required", "");
    }
    else if (pnl8.is(":visible") == false) {
        pnl8.show(500);
        $('#txtExpediente8').attr("required", "");
        $('#txtFechaIni8').attr("required", "");
        $('#txtFechaFin8').attr("required", "");
    }
    else if (pnl9.is(":visible") == false) {
        pnl9.show(500);
        $('#txtExpediente9').attr("required", "");
        $('#txtFechaIni9').attr("required", "");
        $('#txtFechaFin9').attr("required", "");
    }
    else if (pnl10.is(":visible") == false) {
        pnl10.show(500);
        $('#txtExpediente10').attr("required", "");
        $('#txtFechaIni10').attr("required", "");
        $('#txtFechaFin10').attr("required", "");
    }
    else  if (pnl11.is(":visible") == false) {
        pnl11.show(500);
        $('#txtExpediente11').attr("required", "");
        $('#txtFechaIni11').attr("required", "");
        $('#txtFechaFin11').attr("required", "");
    }
    else  if (pnl12.is(":visible") == false) {
        pnl12.show(500);
        $('#txtExpediente12').attr("required", "");
        $('#txtFechaIni12').attr("required", "");
        $('#txtFechaFin12').attr("required", "");
    }
    else  if (pnl13.is(":visible") == false) {
        pnl13.show(500);
        $('#txtExpediente13').attr("required", "");
        $('#txtFechaIni13').attr("required", "");
        $('#txtFechaFin13').attr("required", "");
    }
    else  if (pnl14.is(":visible") == false) {
        pnl14.show(500);
        $('#txtExpediente14').attr("required", "");
        $('#txtFechaIni14').attr("required", "");
        $('#txtFechaFin14').attr("required", "");
    }
    else  if (pnl15.is(":visible") == false) {
        pnl15.show(500);
        $('#txtExpediente15').attr("required", "");
        $('#txtFechaIni15').attr("required", "");
        $('#txtFechaFin15').attr("required", "");
    }
    else
    {
        alert('No se pueden agregagar mas empleados. El límite es de 15.\nPara agregar más debe realizar una captura adicional de Tiempo Extra.');
    }

}

function eliminarEmpleado(posicion) {
    let pnl = $('#pnlEmpleado' + posicion);
    let txtExp = $('#txtExpediente' + posicion);
    let txtFIni = $('#txtFechaIni' + posicion);
    let txtFFin = $('#txtFechaFin' + posicion);
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
    let motivoTE = params.get('motivoTE')
    for (const p of params) {
        //e1=1914823|{fechaIni}|{fechaFin}|{emp.Emp_total_horas}
        let posicion = p[0].replace(/^\D+/g, '');
        let values = p[1].split('|');
        let pnl = $('#pnlEmpleado' + posicion);
        pnl.show(1000);
        let txtExp = $('#txtExpediente' + posicion);
        let txtFIni = $('#txtFechaIni' + posicion);
        let txtFFin = $('#txtFechaFin' + posicion);
        let txtHrs = $('#txtTotalHoras' + posicion);
        let divAsignacion = $('#divAsignacion' + posicion);
        txtExp.attr("required", "");
        txtExp.val(values[0]);
        txtFIni.attr("required", "");
        txtFIni.val(values[1]);
        txtFFin.attr("required", "");
        txtFFin.val(values[2]);
        txtHrs.val(values[3]);
        if (motivoTE != 1){
            //ocultar Tipo de asignación si el tipo no es Siniestro 
            divAsignacion.css("display", "none");
        }

    }

}