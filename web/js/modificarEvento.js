
var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

var jsonEvento;
var usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));

var listTagEvento = new Array();

$(document).ready(function () {

    var retrievedObject = localStorage.getItem('evento');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));

    jsonEvento = JSON.parse(retrievedObject);

    document.getElementById('nombreEvento').value = jsonEvento.nombre;
    document.getElementById('descripcionEvento').value = jsonEvento.descripcion;
    var fi = jsonEvento.fechainicio.replace(" ", "T");
    document.getElementById('fechainicio').value = fi;
    var ff = jsonEvento.fechafin.replace(" ", "T");
    document.getElementById('fechafin').value = ff;
    document.getElementById('direccionEvento').value = jsonEvento.direccion;
    document.getElementById('latitudEvento').value = jsonEvento.latitud;
    document.getElementById('longitudEvento').value = jsonEvento.longitud;

    listTagEvento = jsonEvento.tags;

    findAllTag();
    //findAllTagEvento();

    mostrarChecked();

});

function cancelar() {
    window.location = "listadoEventos.html";
    return false;
}

function findAllTag() {
    console.log(rootURL + 'tag');
    $.ajax({
        type: 'GET',
        url: rootURL + 'tag',
        contentType: 'application/json',
        dataType: "json", // data type of response
        success: mostrarDatos
    });
}

function findAllTagEvento() {
    console.log(rootURL + 'tag/tagsByEvento/' + jsonEvento.id);
    $.ajax({
        type: 'GET',
        url: rootURL + 'tag/tagsByEvento/' + jsonEvento.id,
        contentType: 'application/json',
        dataType: "json", // data type of response
        success: guardarTag
    });
}

function guardarTag(data) {
    listTagEvento = data == null ? [] : (data instanceof Array ? data : [data]);

    $.each(listTagEvento, function (index, tag) {
        console.log(tag.nombre);
        var select = $('#' + tag.id);
        select.attr("selected", "selected");
    });
}

function mostrarDatos(data) {
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $.each(list, function (index, tag) {
        console.log(tag.nombre);
        var select = $('<option></option><br/>');
        select.val(tag.nombre);
        select.append(tag.nombre);
        select.attr("id", tag.id);
        $('#selectTag').append(select);
    });
}

function guardarEvento() {
    console.log('eventoModificado');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + 'evento/' + jsonEvento.id,
        data: formToJSON(),
        success: function (response) {
            console.log(response);
            window.location = "listadoEventos.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function formToJSON() {
    console.log($('#selectTag').val());
    var json = JSON.stringify({
        creador: usuarioSesion.email,
        descripcion: $('#descripcionEvento').val(),
        direccion: $('#direccionEvento').val(),
        fechainicio: $('#fechainicio').val(),
        fechafin: $('#fechafin').val(),
        longitud: $('#longitudEvento').val(),
        latitud: $('#latitudEvento').val(),
        nombre: $('#nombreEvento').val(),
        tags: check(),
        validado: jsonEvento.validado
    }
    );
    console.log(json);
    return json;
}


function mostrarChecked() {
    for (tag in jsonEvento.tags) {
        document.getElementById(jsonEvento.tags[tag]).checked = true;
    }
}

function check() {
    listTagEvento = [];
    $('#.check:checked').each(function () {
        console.log($(this));
        var tag = $(this).attr('id');
        listTagEvento.push(tag);
    });
    console.log(listTagEvento);
    return listTagEvento;
}