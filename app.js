generateBarcode();

function generateBarcode() {
  let bcTypes = document.getElementById("barcodeTypesSelect").value;
  let bcTarget = $("#bcTarget").empty().barcode($("#data").val(), bcTypes, {
    barWidth: 1,
    barHeight: 80,
    showHRI: true,
    output: "svg",
  });
  if (bcTarget[0].innerHTML === "") {
    document.getElementById("bcTarget").innerHTML =
      "條碼數據與所選類別格式不符合!";
    document.getElementById("bcTarget").style.padding = "37px 0px";
    document.getElementById("bcTarget").style.width = null;
    document.getElementById("bcTarget").style.color = "red";
  }
  return bcTarget;
}

let section = document.querySelector("section");
let add = document.querySelector("button");
add.addEventListener("click", (e) => {
  e.preventDefault();

  let bcName = bcname.value;
  let bcData = data.value;
  // input value checking
  if (bcData === "" || bcName === "") {
    alert("Please Enter some text.");
    return;
  }
  // name checking
  let barcodeListArray = [];
  barcodeListArray = JSON.parse(localStorage.getItem("list"));
  let listLength = 0;
  if (barcodeListArray != null) {
    listLength = barcodeListArray.length;
  }
  for (let i = 0; i < listLength; i++) {
    if (bcname.value == barcodeListArray[i].bcName) {
      alert("請更改名稱，列表內已重複。");
      return;
    }
  }
  // create a list
  let barcodeList = document.createElement("div");
  barcodeList.classList.add("list");
  let barcodeName = document.createElement("p");
  barcodeName.classList.add("list-name");
  barcodeName.innerText = bcName;
  let bcImg = bcTarget.firstElementChild;
  let barcodeData = document.createElement("img");
  let bcImgBase64Str = bcTarget.firstElementChild.src;
  barcodeData = bcImg;
  barcodeData.classList.add("list-barcode");
  barcodeData.innerText = bcData;
  barcodeList.appendChild(barcodeName);
  barcodeList.appendChild(barcodeData);

  // create trash button
  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashButton.addEventListener("click", (e) => {
    let bcList = e.target.parentElement;
    bcList.addEventListener("animationend", () => {
      // remove from local storage
      let myList = localStorage.getItem("list");
      let myListArray = JSON.parse(myList);
      let text = bcList.children[0].innerText;
      myListArray.forEach((item, index) => {
        if (item.bcName == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      bcList.remove();
    });
    bcList.style.animation = "scaleDown 0.25s forwards";
  });

  barcodeList.appendChild(trashButton);

  barcodeList.style.animation = "scaleUp 0.25s forwards";

  // create an object
  let myBarcode = {
    bcName: bcName,
    bcData: bcData,
    bcImg: bcImgBase64Str,
  };

  // store data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myBarcode]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myBarcode);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  section.appendChild(barcodeList);
  generateBarcode();
  bcname.value = "";
});

loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      // create a list, from myBarcode object
      let barcodeList = document.createElement("div");
      barcodeList.classList.add("list");
      let barcodeName = document.createElement("p");
      barcodeName.classList.add("list-name");
      barcodeName.innerText = item.bcName;
      let barcodeData = document.createElement("img");
      barcodeData.src = item.bcImg;
      barcodeData.classList.add("list-barcode");
      barcodeData.innerText = item.bcData;
      barcodeList.appendChild(barcodeName);
      barcodeList.appendChild(barcodeData);

      // create trash button
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let bcList = e.target.parentElement;
        bcList.addEventListener("animationend", () => {
          // remove from local storage
          let text = bcList.children[0].innerText;
          myListArray.forEach((item, index) => {
            if (item.bcName == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          bcList.remove();
        });
        bcList.style.animation = "scaleDown 0.25s forwards";
      });

      barcodeList.appendChild(trashButton);
      section.appendChild(barcodeList);
    });
  }
}
