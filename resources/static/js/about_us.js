   $('#search').on('input', function(){
    var text = $(this).val();
    if(text=='bcit'){
//        console.log("this is good");
        $("form").append("<br><img id='memeimg' src='/static/img/meme.jpg'>");
//        $("#judaoimg").hide();
    }else {
        
        $('#memeimg').hide();
    }
             
});

   $('#search').on('input', function(){
    var text = $(this).val();
    if(text=='programmer'){
//        console.log("this is good");
        $("form").append("<br><img id='meme2img' src='/static/img/programmer_meme.jpg'>");
//        $("#judaoimg").hide();
    }else {
        
        $('#meme2img').hide();
    }
             
});

  $('#search').on('input', function(){
    var text = $(this).val();
    if(text=='cst'){
//        console.log("this is good");
        $("form").append("<br><img id='meme3img' src='/static/img/cst_meme.jpg'>");
//        $("#judaoimg").hide();
    }else {
        
        $('#meme3img').hide();
    }
             
});