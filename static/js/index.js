// import "./css/index.css";
// import $ from "jquery";
// import "slick-slider";

document.querySelectorAll("#range").forEach((element) => {
  element.oninput = (e) => {
    e.target.parentElement.querySelector("#val").innerText = e.target.value;
    let point = e.target.value;
    updateHyperGrid(point, e.target.parentElement.parentElement);
  };
});

function updateHyperGrid(point, selector) {
  const n = 10.2508;
  let left = n * point * 100;
  $(selector.querySelector(".scene-imgs > img")).css('left', -left + '%');
}




