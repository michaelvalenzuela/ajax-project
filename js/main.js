let $recallRetainer = document.getElementById("recalls");
{/*
  <div class="recall">
  <h2 class="product-title">Product Name</h2>
  <p class="reason-text">
    Reason for recall
            </p>
  <div class="recall-row ">
    <h5 class="footer-recall">City, State</h5>
    <h5 class="footer-recall right">Recall Date</h5>
  </div>
</div>
*/}
function getRecalls(){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.fda.gov/food/enforcement.json?search=report_date:[20040101+TO+20131231]&limit=10")
  xhr.responseType = "json";
  xhr.addEventListener('load', function() {
    console.log(xhr.status);
    console.log(xhr.response);
  });
  xhr.send();
}

function renderRecalls(){
  removeAllChildNodes($recallRetainer);

}

function removeAllChildNodes(parent){
  while(parent.firstChild){
    parent.removeCHild(parent.firstChild);
  }
}
