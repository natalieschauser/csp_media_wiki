<?php
  function changeFile($file) {
    $contents = file_get_contents($file);
    $contents = str_replace(
        'Html::inlineScript(',
        'Html::linkAndCreate(',
        $contents
    );
    file_put_contents($file, $contents);
  }
  
  //changeFile('../includes/OutputPage.php');
  // changeFile('../includes/EditPage.php');
?>