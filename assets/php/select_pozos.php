<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

include_once('conexion.php');

$results = array();
$json_array = [];

$query = "SELECT id, nombre, zona FROM pozos";
$rs    = mysqli_query($conn, $query) or die(mysqli_error($conn));
$count = mysqli_num_rows($rs);

if($count> 0){
    $json_array = array(
        "resp" => "success",
        "message" => "Pozos registrados"
    );
    array_push($results, $json_array);

    while($row = mysqli_fetch_array($rs)){
        $json_array = array(
            "id" => $row['id'],
            "nombre" => $row['nombre'],
            "zona" => $row['zona'],
        );
        array_push($results, $json_array);
    };
}else{
    $json_array = array(
        "resp" => "error",
        "message" => "No se encontraron pozos registrados"
    );
    array_push($results, $json_array);
}

echo json_encode($results);
mysqli_close($conn);
?>