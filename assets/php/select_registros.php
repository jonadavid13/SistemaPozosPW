<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

include_once('conexion.php');

$results = array();
$registros = array();
$json_array = [];

$query = "SELECT mediciones.id, pozos.nombre AS pozo, mediciones.marcaTemporal, mediciones.medicion 
            FROM mediciones INNER JOIN pozos ON mediciones.idPozo = pozos.id";
$rs    = mysqli_query($conn, $query) or die(mysqli_error($conn));
$count = mysqli_num_rows($rs);

if($count > 0){
    $json_array = array(
        "status" => "success",
        "message" => "Registros encontrados"
    );
    array_push($results, $json_array);

    while($row = mysqli_fetch_array($rs)){
        $json_array = array(
            "id" => $row['id'],
            "pozo" => $row['pozo'],
            "fecha" => $row['marcaTemporal'],
            "medicion" => $row['medicion'],
        );
        array_push($registros, $json_array);
    };

    array_push($results, $registros);
}else{
    $json_array = array(
        "status" => "error",
        "message" => "No se encontraron registros"
    );
    array_push($results, $json_array);
}

echo json_encode($results);
mysqli_close($conn);
?>