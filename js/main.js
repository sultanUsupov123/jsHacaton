let inpImage = document.querySelector("#inpImage");
let inpCountry = document.querySelector("#inpCountry");
let inpMarka = document.querySelector("#inpMarka");
let inpModel = document.querySelector("#inpModel");
let inpCapa = document.querySelector("#inpCapa");
let inpPrice = document.querySelector("#inpPrice");
let inpYear = document.querySelector("#inpYear");
let createBtn = document.querySelector("#createBtn");
let form = document.querySelector("#create-form");
let cardsContainer = document.querySelector(".cards-container");
const API = "http://localhost:8000/info";
let inpSearch = document.querySelector("#inpSearch");
let paginPrevBtn = document.querySelector("#paginPrevBtn");
let paginNextBtn = document.querySelector("#paginNextBtn");
let currentPage = 1;
let pageLength = 1;
let categoryBtns = document.querySelectorAll(".filter-btn");
let filterValue = "Все";
let exitInAdminBtn = document.querySelector("#exitInAdmin");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    !inpImage.value.trim() ||
    !inpCountry.value.trim() ||
    !inpMarka.value.trim() ||
    !inpModel.value.trim() ||
    !inpCapa.value.trim() ||
    !inpPrice.value.trim() ||
    !inpYear.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  let newInfo = {
    imgUrl: inpImage.value,
    country: inpCountry.value,
    marka: inpMarka.value,
    model: inpModel.value,
    capa: inpCapa.value,
    price: inpPrice.value,
    year: inpYear.value,
  };
  createCard(newInfo);
});
//! create card
async function createCard(objInfo) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objInfo),
  });
  JSON.parse(localStorage.getItem("isAdmin")) ? readCardAdmin() : readCard();
  let inputs = document.querySelectorAll(".createInp");
  inputs.forEach((elem) => {
    elem.value = "";
  });
}

//! show card
async function readCard(letter = "") {
  let res =
    filterValue !== "Все"
      ? await fetch(
          `${API}?q=${letter}&_page=${currentPage}&_limit=3&marka=${filterValue}`
        )
      : await fetch(`${API}?q=${letter}&_page=${currentPage}&_limit=3`);
  let data = await res.json();
  cardsContainer.innerHTML = "";
  if (JSON.parse(localStorage.getItem("isAdmin")) === false) {
    data.forEach((elem) => {
      cardsContainer.innerHTML += `
      <div class="car-card">
      <img src="${elem.imgUrl}"/>
      <p>Country:${elem.country}</p>
      <p>Marka:${elem.marka}</p>
      <p>Model:${elem.model}</p>
      <p>Capacity:${elem.capa}</p>
      <p>Price:${elem.price}</p>
      <p>Year:${elem.year}</p>
      </div>
      `;
    });
    countPages();
  }
}
async function readCardAdmin(letter = "") {
  let res =
    filterValue !== "Все"
      ? await fetch(
          `${API}?q=${letter}&_page=${currentPage}&_limit=3&marka=${filterValue}`
        )
      : await fetch(`${API}?q=${letter}&_page=${currentPage}&_limit=3`);
  let data = await res.json();
  cardsContainer.innerHTML = "";
  if (JSON.parse(localStorage.getItem("isAdmin")) === true) {
    data.forEach((elem) => {
      cardsContainer.innerHTML += `
    <div class="car-card">
    <img src="${elem.imgUrl}"/>
    <p>Country:${elem.country}</p>
    <p>Marka:${elem.marka}</p>
    <p>Model:${elem.model}</p>
    <p>Capacity:${elem.capa}</p>
    <p>Price:${elem.price}</p>
    <p>Year:${elem.year}</p>
    <button class="card-btns" onclick="deleteInfo(${elem.id})">delete</button>
    <button class="card-btns" onclick="showEditModal(${elem.id})">edit</button>
    </div>
    `;
    });
    countPages();
  }
}
JSON.parse(localStorage.getItem("isAdmin")) ? readCardAdmin() : readCard();

//! delete
async function deleteInfo(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readCardAdmin();
}

//! update edit
let inpImageEdit = document.querySelector("#inpImageEdit");
let inpCountryEdit = document.querySelector("#inpCountryEdit");
let inpMarkaEdit = document.querySelector("#inpMarkaEdit");
let inpModelEdit = document.querySelector("#inpModelEdit");
let inpCapaEdit = document.querySelector("#inpCapaEdit");
let inpPriceEdit = document.querySelector("#inpPriceEdit");
let inpYearEdit = document.querySelector("#inpYearEdit");
let closeEditModal = document.querySelector("#closeEditModal");
let saveEditBtn = document.querySelector("#saveEditBtn");
let modal = document.querySelector(".modal-window");
let modalForm = document.querySelector("#modal-form");

async function showEditModal(id) {
  modal.style.display = "block";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  inpImageEdit.value = data.imgUrl;
  inpCountryEdit.value = data.country;
  inpMarkaEdit.value = data.marka;
  inpModelEdit.value = data.model;
  inpCapaEdit.value = data.capa;
  inpPriceEdit.value = data.price;
  inpYearEdit.value = data.year;
  saveEditBtn.setAttribute("id", data.id);
}

modalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let editedInfo = {
    imgUrl: inpImageEdit.value,
    country: inpCountryEdit.value,
    marka: inpMarkaEdit.value,
    model: inpModelEdit.value,
    capa: inpCapaEdit.value,
    price: inpPriceEdit.value,
    year: inpYearEdit.value,
  };
  editInfoFunc(editedInfo, saveEditBtn.id);
});

async function editInfoFunc(editedInfo, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedInfo),
  });
  readCardAdmin();
  modal.style.display = "none";
}

// ! close modal-window
closeEditModal.addEventListener("click", () => {
  modal.style.display = "none";
});

//! search
inpSearch.addEventListener("input", (event) => {
  JSON.parse(localStorage.getItem("isAdmin"))
    ? readCardAdmin(event.target.value)
    : readCard(event.target.value);
});

// ! pagination
async function countPages() {
  let res = await fetch(API);
  let data = await res.json();
  pageLength = Math.ceil(data.length / 3);
}
paginPrevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  JSON.parse(localStorage.getItem("isAdmin")) ? readCardAdmin() : readCard();
});
paginNextBtn.addEventListener("click", () => {
  if (currentPage >= pageLength) return;
  currentPage++;
  JSON.parse(localStorage.getItem("isAdmin")) ? readCardAdmin() : readCard();
});

//! filter
categoryBtns.forEach((elem) => {
  elem.addEventListener("click", () => {
    if ((filterValue = elem.innerText)) {
      JSON.parse(localStorage.getItem("isAdmin"))
        ? readCardAdmin()
        : readCard();
    }
  });
});

//! adminka
let passwordInpForAdmin = document.querySelector("#passwordInpForAdmin");
let signInAdminBtn = document.querySelector("#signInAdmin");

localStorage.setItem("isAdmin", JSON.stringify(false));
signInAdminBtn.addEventListener("click", () => {
  passwordInpForAdmin.style.display = "block";
});
passwordInpForAdmin.addEventListener("change", (e) => {
  passwordValue();
  e.preventDefault();
});
async function passwordValue() {
  let res = await fetch("http://localhost:8000/admin");
  let data = await res.json();
  console.log(data);
  if (data.password == passwordInpForAdmin.value) {
    alert("Hello Sultan");
    passwordInpForAdmin.value = "";
    exitInAdminBtn.style.display = "block";
    signInAdminBtn.style.display = "none";
    passwordInpForAdmin.style.display = "none";
    localStorage.setItem("isAdmin", JSON.stringify(true));
    readCardAdmin();
  }
}

//! signIn
exitInAdminBtn.addEventListener("click", () => {
  localStorage.setItem("isAdmin", JSON.stringify(false));
  signInAdminBtn.style.display = "block";
  exitInAdminBtn.style.display = "none";
  readCard();
});
