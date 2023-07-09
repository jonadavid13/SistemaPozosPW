<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

include_once('conexion.php');

$results = array();
$json_array = [];

$data = json_decode(file_get_contents('php://input'), true);

if(isset($data['idPozo']) && isset($data['Fecha']) && isset($data['Valor'])){

    if(!empty($data['idPozo']) && !empty($data['Fecha']) && !empty($data['Valor'])){
        $pozo = $data['idPozo'];
        $fecha = $data['Fecha'];
        $valor = $data['Valor'];

        $query = "INSERT INTO mediciones(idPozo,marcaTemporal,medicion) VALUES ('$pozo', '$fecha', '$valor')";
        $rs    = mysqli_query($conn, $query) or die(mysqli_error($conn));

        if($rs == true){
            $json_array = array(
                "status" => "success",
                "message" => "Pozo registrado"
            );
            array_push($results, $json_array);
        }else{
            $json_array = array(
                "status" => "error",
                "message" => "Error al registrar"
            );
            array_push($results, $json_array);
        }
    }else{
        $json_array = array(
            "status" => "error",
            "message" => "Envío de datos vacíos"
        );
        array_push($results, $json_array);
    }
} else {
    $json_array = array(
        "status" => "error",
        "message" => "No se han enviado datos"
    );
    array_push($results, $json_array);
}

echo json_encode($results);

?>