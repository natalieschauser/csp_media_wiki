<?php
  function changeFile($file) {
    $contents = file_get_contents($file);
    $contents = preg_replace(
        'Html::inlineScript\(',
        'linkAndCreate\(',
        $contents
    );
    file_put_contents($file, $contents);
  }
?>