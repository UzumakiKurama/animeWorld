var counter = 0;
const img1 = document.getElementById("img-1");
const img2 = document.getElementById("img-2");
const img3 = document.getElementById("img-3");
const img4 = document.getElementById("img-4");
const img5 = document.getElementById("img-5");

let imgs = [
  `url(${img1.src})`,
  `url(${img2.src})`,
  `url(${img3.src})`,
  `url(${img4.src})`,
  `url(${img5.src})`,
];
console.log(imgs);
function changeBG() {
  if (imgs.length === 5) {
    if (counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
  }
}

setInterval(changeBG, 4000);
