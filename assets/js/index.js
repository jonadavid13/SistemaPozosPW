function seleccionarPozos() {
  $.ajax({
    type: "POST",
    url: "assets/php/select_pozos.php",
    dataType: "json",
    beforeSend: function () {
      console.log("Esperando los datos del BACK");
    },
    success: function (resp) {
      console.log(resp);

      let selectPozos = `<select id="selectPozos" class="form-select" name="selectPozos" tabindex="-1" required>
                                <option selected>Seleccione...</option>`;

      for (i = 1; i <= resp.length - 1; i++) {
        selectPozos += `<option value='${resp[i].id}'>
                                ${resp[i].nombre}
                                </option>`;
      }
      selectPozos += `</select>`;

      $("#selectPozos").html(selectPozos);
    },
    fail: function (jqXHR, textStatus, errorThown) {
      console.log(textStatus, errorThown);
    },
    error: function (jqXHR, textStatus, errorThown) {
      console.log(textStatus, errorThown);
    },
  });
}

seleccionarPozos();

function resetFormRegistros() {
  document.getElementById("RegistrosForm").reset();
  cerrarFormPozo();
}

function agregarPozo() {
  //const btnDisabled = '<button id="#btnAgregarPozo" type="button" class="btn btn-success" disabled>Agregar pozo</button>';
  //$('#btnAgregarPozo').replaceWith(btnDisabled);
  document.getElementById("btnAgregarPozo").setAttribute("disabled", true);
  document.getElementById("btnRegistrar").setAttribute("disabled", true);
  $("#agregarPozoForm").removeClass("disabled");
  document.getElementById("idNombre").focus();
}

function cerrarFormPozo() {
  document.getElementById("alertForm").innerHTML = "";

  document.getElementById("btnAgregarPozo").removeAttribute("disabled");
  document.getElementById("btnRegistrar").removeAttribute("disabled", true);
  $("#agregarPozoForm").addClass("disabled");
  seleccionarPozos();

  document.getElementById("idNombre").value = "";
  document.getElementById("selectZona").selectedIndex = 0;
}

function guardarPozo() {
  const alertForm = document.getElementById("alertForm");
  const nombrePozo = document.getElementById("idNombre").value;
  const zona = document.getElementById("selectZona");

  if (
    nombrePozo === " " ||
    nombrePozo === "" ||
    zona.selectedIndex == -1 ||
    zona.selectedIndex == 0
  ) {
    document.getElementById(
      "alertForm"
    ).innerHTML = `<div class="alert alert-warning d-flex justify-content-between" role="alert">
                    <span>Se deben completar todos los campos</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
  } else if (
    nombrePozo != "" &&
    (zona.selectedIndex != -1 || zona.selectedIndex != 0)
  ) {
    alertForm.innerHTML = "";

    const params = {
      Nombre: nombrePozo,
      Zona: zona.value,
    };

    const data = JSON.stringify(params);

    $.ajax({
      type: "POST",
      url: "assets/php/insertarPozo.php",
      dataType: "json",
      data: data,
      beforeSend: function () {
        console.log("Enviando datos al Backend");
      },
      success: function (resp) {
        console.log(resp);

        if (resp[0].status == "success") {
          alertForm.innerHTML = `<div class="alert alert-success d-flex justify-content-between" role="alert">
                    <span>${resp[0].message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
        } else if (resp[0].status == "error") {
          alertForm.innerHTML = `<div class="alert alert-danger d-flex justify-content-between" role="alert">
                    <span>${resp[0].message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
        }

        cerrarFormPozo();
      },
      fail: function (jqXHR, textStatus, errorThown) {
        console.log("Fail AJAX", textStatus, errorThown);
      },
      error: function (jqXHR, textStatus, errorThown) {
        console.log("Error AJAX", textStatus, errorThown);
      }
    });
  }
}

function guardarRegistro() {
  const alertForm = document.getElementById("alertForm");
  const pozo = document.getElementById("selectPozos");
  const valor = document.getElementById("idValor").value;
  const fecha = document.getElementById("idFecha").value;

  if (
    pozo.selectedIndex == -1 ||
    pozo.selectedIndex == 0 ||
    valor == "" ||
    valor == " " ||
    fecha == ""
  ) {
    alertForm.innerHTML = `<div class="alert alert-warning d-flex justify-content-between" role="alert">
        <span>Se deben completar todos los campos</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  } else if (!validar()) {
    alertForm.innerHTML = `<div class="alert alert-warning d-flex justify-content-between" role="alert">
        <span>El valor de las medidas puede tener como máximo tres (3) dígitos y tres (3) decimales. </span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  } else {
    alertForm.innerHTML = "";

    const params = {
        'idPozo': pozo.value,
        'Fecha': fecha,
        'Valor': valor
    }

    const data = JSON.stringify(params);

    $.ajax({
        type: "POST",
        url: "assets/php/insertar.php",
        dataType: "json",
        data: data,
        beforeSend: function () {
            console.log("Enviando datos");
        },
        success: function (resp) {
            console.log(resp);

            if (resp[0].status == "success") {
                alertForm.innerHTML = `<div class="alert alert-success d-flex justify-content-between" role="alert">
                    <span>${resp[0].message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
            } else if (resp[0].status == "error") {
                alertForm.innerHTML = `<div class="alert alert-danger d-flex justify-content-between" role="alert">
                    <span>${resp[0].message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
            }

            cerrarFormPozo();
            selectRegistros();
            window.location.reload();
        },
        fail: function (jqXHR, textStatus, errorThown) {
            console.log("Fail AJAX", textStatus, errorThown);
        },
        error: function (jqXHR, textStatus, errorThown) {
            console.log("Error AJAX", textStatus, errorThown);
        }
    });
  }
}

function validar() {
  inputValor = document.querySelector("#idValor");

  const value = inputValor.value;
  const regex = /^\d{1,3}(\.\d{0,3})?$/;
  if (!regex.test(value)) {
    inputValor.setCustomValidity(
      "El valor debe tener un máximo de 3 decimales"
    );
    return false;
  } else {
    inputValor.setCustomValidity("");
    return true;
  }
}

function selectRegistros(){
    $.ajax({
        type: "POST",
        url: "assets/php/select_registros.php",
        dataType: "json",
        beforeSend: function () {
          console.log("Esperando los datos");
        },
        success: function (resp) {
          console.log(resp);

        if (resp[0].status == "success") {
            const registros = resp[1];

            let table = `<table id="tablaRegistros" class="tabla-registros table table-striped table-hover rounded-4">
            <thead class="table-header">
                <tr class="header-row">
                    <th scope="col">ID</th>
                    <th scope="col">Pozo</th>
                    <th scope="col">Fecha y hora</th>
                    <th scope="col">Medición (PSI)</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>`;
            registros.forEach(element => {
                table += `<tr>
                    <td>${element.id}</td>
                    <td>${element.pozo}</td>
                    <td>${element.fecha}</td>
                    <td class="mediciones-cell">${element.medicion}</td>
                    <td>
                        <button type="button" class="btnEditarRegistro btn btn-warning" onclick="editarRegistro(${element.id})">Editar</button>
                        <button type="button" class="btnEliminarRegistro btn btn-danger" onclick="eliminarRegistro(${element.id})">Eliminar</button>
                    </td>
                </tr>`
            });
            table += `</tbody></table>`;

            $('#tablaRegistros').html(table);
        } else if (resp[0].status == "error") {

        }
        
          //$("#selectPozos").html(selectPozos);
        },
        fail: function (jqXHR, textStatus, errorThown) {
          console.log(textStatus, errorThown);
        },
        error: function (jqXHR, textStatus, errorThown) {
          console.log(textStatus, errorThown);
        },
    });
}

function editarRegistro(id){

}

function eliminarRegistro(id){
    const data = JSON.stringify({
        'idRegistro': id
    })

    $.ajax({
        type: "POST",
        url: "assets/php/eliminar.php",
        dataType: "json",
        data: data,
        beforeSend: function () {
            console.log("Enviando datos para eliminar registro");
        },
        success: function (resp) {
            console.log(resp);
            window.location.reload();
        },
        fail: function (jqXHR, textStatus, errorThown) {
            console.log(textStatus, errorThown);
        },
        error: function (jqXHR, textStatus, errorThown) {
            console.log(textStatus, errorThown);
        },
    });
}

selectRegistros();
