<?php
ini_set('include_path', dirname(__FILE__));

//Avoid warnings in case "date.timezone" option is not set (PHP 5.3+)
if (!ini_get('date.timezone') && function_exists('date_default_timezone_get')) {
	date_default_timezone_set(@date_default_timezone_get());
}

require_once('Zend/Loader/Autoloader.php');
Zend_Loader_Autoloader::getInstance();