var counter = 0;
function changeBG(){
    var imgs = [
        "url(./images/949067.jpg)",
        "url(./images/1035095.png)",
        "url(./images/1061011.jpg)",
        "url(./images/859804.png)",
        "url(./images/39041.jpg)",
        "url(./images/31513.jpg)",
      ]
    
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}
  
  setInterval(changeBG, 4000);
