<?php

	$inputData = $_POST;

	sleep(1);

	echo json_encode(array(
		'status' => (time() % 5 === 1) ? 'error' : 'ok',
		'input' => $inputData
	));

?>