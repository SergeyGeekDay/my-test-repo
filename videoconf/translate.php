<?php
// header('Content-Type: text/plain; charset=utf8'); 	

// $ya_get_langs = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?';
$ya_translate = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
$ya_key = 'key=trnsl.1.1.20160706T213751Z.8c13d085a7461f88.7d2c55f547eb0f131e33e078c86a90cbbbda6378';
$ya_par =  'lang=ru-en';
$ya_tx = 'text=Обычная такая херня';
$ya_lfn = 'text=Жизнь за Нер-Зула';
$ya_url = "$ya_translate$ya_key&$ya_par&$ya_tx&$ya_lfn";
var_dump($ya_url); 
// $cr = curl_init($ya_url);
// curl_setopt_array($cr, array(
	// CURLOPT_RETURNTRANSFER => true,
	// CURLOPT_CERTINFO => true,
	// CURLOPT_SSL_VERIFYPEER => true,
// ));
// var_dump(curl_exec($cr));
// var_dump(curl_getinfo($cr));
// var_dump(curl_error($cr));
// curl_close($cr);

$cont = file_get_contents($ya_url);
var_dump($cont);

echo '<script>function func($yt) {
	console.log($yt);
}</script>';
echo '<script src="' . $ya_url . '&callback=func"></script>';

?>