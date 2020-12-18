let $recallRetainer = document.getElementById("recalls");
let $recallDetail = document.getElementById("recallDetail");
let $recallSearchPage = document.getElementById("recallSearchPage");
let $submitButton = document.querySelector(".submit-btn");
let $form = document.querySelector("form");
let recalls = [];

$form.addEventListener("submit", function(e){
  e.preventDefault();
  let startDate = $form.startDate.value.replaceAll("-","");
  let endDate = $form.endDate.value.replaceAll("-", "");
  let location = $form.location.value;
  getRecalls(startDate, endDate, location);
});

function createURL(startDate, endDate, state){
  let url = "https://api.fda.gov/food/enforcement.json?search=";
  if(startDate && endDate){
    let reportDateField = "report_date:[" + startDate + "+TO+" + endDate + "]";
    url += reportDateField;
  }
  if(state){
    let stateField = "state:" + state;
    url += stateField;
  }
  url += "&limit=10";
  return url;
}

function getRecalls(startDate, endDate, state){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", createURL(startDate, endDate, state));
  xhr.responseType = "json";
  xhr.addEventListener("load", function(){
    recalls = xhr.response.results;
    if(recalls){
      renderRecalls();
    }
    else{
      removeAllChildNodes($recallRetainer);
    }
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

    $recallDiv.addEventListener('click', function(e){
      console.log(recall);
      renderRecallDetail(recall);
    });

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

function renderRecallDetail(recall) {
  removeAllChildNodes($recallDetail);

  $recallSearchPage.classList.add("hide");

  let $productName = document.createElement("h2");
  $productName.classList.add("product-title");
  $productName.textContent = recall.product_description;

  let $location = document.createElement("h3");
  $location.textContent = recall.address_1 + ", " + recall.city + ", " + recall.state;

  let $amountRecalled = document.createElement("h4");
  $amountRecalled.textContent = recall.product_quantity;

  let $reasonForRecallTitle = document.createElement("h5");
  $reasonForRecallTitle.textContent = "Reason For Recall:";

  let $reasonForRecallText = document.createElement("p");
  $reasonForRecallText.textContent = recall.reason_for_recall;

  let $reportDate = document.createElement("h5");
  $reportDate.textContent = transformDate(recall.report_date);

  $recallDetail.appendChild($productName);
  $recallDetail.appendChild($location);
  $recallDetail.appendChild($amountRecalled);
  $recallDetail.appendChild($reasonForRecallTitle);
  $recallDetail.appendChild($reasonForRecallText);
  $recallDetail.appendChild($reportDate);

  console.log(recall);

  $recallDetail.classList.remove("hide");
}
getRecalls();
