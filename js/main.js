let $recallRetainer = document.getElementById("recalls");
let $submitButton = document.querySelector(".submit-btn");
let $form = document.querySelector("form");
let recalls = [];

$form.addEventListener("submit", function(e){
  e.preventDefault();
  let startDate = $form.startDate.value.replaceAll("-","");
  let endDate = $form.endDate.value.replaceAll("-", "");
  let location = $form.location.value;
  if(startDate && endDate){
    getRecallsByDates(startDate, endDate);
  }
  else if(location){
    getRecallsByLocation(location);
  }
});


function getRecallsByDates(startDate, endDate) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.fda.gov/food/enforcement.json?search=report_date:[" + startDate +"+TO+"+ endDate + "]&limit=10");
  xhr.responseType = "json";
  xhr.addEventListener('load', function () {
    recalls = xhr.response.results;
    if(recalls){
      renderRecalls();
    }
    else {
      removeAllChildNodes($recallRetainer);
    }
  });
  xhr.send();
}

function getRecallsByLocation(location){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.fda.gov/food/enforcement.json?search=state:"+location+"&limit=10");
  xhr.responseType = "json";
  xhr.addEventListener("load", function(){
    recalls = xhr.response.results;
    if(recalls){
      renderRecalls();
    }
    else {
      removeAllChildNodes($recallRetainer);
    }
  });
  xhr.send();
}


function getRecalls(){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.fda.gov/food/enforcement.json?search=report_date:[20040101+TO+20201231]&limit=10")
  xhr.responseType = "json";
  xhr.addEventListener('load', function() {
    recalls = xhr.response.results;
    renderRecalls();
  });
  xhr.send();
}

function renderRecalls(){
  removeAllChildNodes($recallRetainer);
  for(recall of recalls){
    let $recallDiv = document.createElement("div");
    $recallDiv.classList.add("recall");

    let $productTitle = document.createElement("h2");
    $productTitle.classList.add("product-title");
    $productTitle.textContent = transformReason(recall.product_description);

    let $reasonText = document.createElement("p");
    $reasonText.classList.add("reason-text");
    $reasonText.textContent = recall.reason_for_recall;

    let $recallRow = document.createElement("recall-row");
    $recallRow.classList.add("recall-row");

    let $footerLocation = document.createElement("h5");
    $footerLocation.classList.add("footer-recall");
    $footerLocation.textContent = recall.city + ", " + recall.state;

    let $footerDate = document.createElement("h5");
    $footerDate.classList.add("footer-recall");
    $footerDate.textContent = transformDate(recall.recall_initiation_date);

    $recallRow.appendChild($footerLocation);
    $recallRow.appendChild($footerDate);

    $recallDiv.appendChild($productTitle);
    $recallDiv.appendChild($reasonText);
    $recallDiv.appendChild($recallRow);

    $recallRetainer.appendChild($recallDiv);
  }
}

function removeAllChildNodes(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

function transformDate(date){
  let year = date.slice(0,4);
  let month = date.slice(4,6);
  let day = date.slice(6);
  let transformedDate = year + "-" + month + "-" + day;
  return transformedDate;
}

function transformReason(str){
  let end = str.indexOf(",");
  if(end < 0){
    end = 20;
  }
  return str.slice(0, end) + "...";
}

getRecalls();
