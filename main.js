"use strict";

// Кнопка "добавить новый": открытие модалки и ее удаление из ДОМ-дерева после закрытия

function getAddNewHTML(url) {
  return fetch(url, {
    method: "GET",
  });
}

function wrapper(url) {
  getAddNewHTML(url)
    .then((res) => res.text())
    .then((data) => {
      if ((window.location.hash = "#list")) {
        printFilms();
      }

      document.getElementById("add-new").addEventListener("click", function () {
        document.body.innerHTML += data;
        addDeletePosition(data);
        previewFile(data);
        saveNew(data);

        let $modal = document.getElementById("modalNew");

        $("#modalNew").on("hidden.bs.modal", function () {
          $modal.remove();
          search();
          allMovies();
        });

        wrapper("./add-new.html");
      });
    });
}

wrapper("./add-new.html");

// Кнопка "добавить новый": добавление новых данных в localStorage и ее удаление из ДОМ-дерева после "сохранить"

function saveNew() {
  let $btnSave = document.getElementById("modal_submite");

  $btnSave.addEventListener("click", function (e) {
    let $modal = document.getElementById("modalNew");
    let arrInputs = $modal.querySelectorAll("input");
    let arrTextarea = $modal.querySelectorAll("textarea");
    let arrPos = $modal.querySelectorAll(".add-input-pos");
    let arrPosName = $modal.querySelectorAll(".add-input-pos-name");
    let list = localStorage.films ? JSON.parse(localStorage.films) : [];

    let obj = {
      id: Date.now(),
    };

    arrInputs.forEach(function (item) {
      obj[item.dataset.name] = item.value;
    });
    arrTextarea.forEach(function (item) {
      obj[item.dataset.name] = item.value;
    });

    let objPos = {};
    arrPos.forEach(function (item, index) {
      delete obj[item.dataset.name];
      delete obj[arrPosName[index].dataset.name];
      objPos[item.value] = arrPosName[index].value;
    });

    obj.positionAll = objPos;

    let localArr = JSON.parse(localStorage.file);
    let localObj = localArr[0].value;

    obj.poster = localObj;

    list.push(obj);
    localStorage.films = JSON.stringify(list);
    localStorage[obj.id] = JSON.stringify(obj);

    localStorage.removeItem("file");

    let $modalBgColor = document.querySelector(".modal-backdrop");

    $modal.remove();
    $modalBgColor.remove();

    search();
    allMovies();
    printFilms();
  });
}

// Кнопка "добавить/удалить" должность внутри модалки

function addDeletePosition() {
  let $modalBody = document.querySelector(".modal-body");

  $modalBody.addEventListener("click", function (e) {
    let $parent = document.querySelector("fieldset");
    if (e.target.closest(".btn-add-field")) {
      let div = document.createElement("div");
      div.className = "addPosition form-group row";
      div.innerHTML = `<div class="col-sm-5"><input data-name="position" type="text" class="form-control add-input-pos" placeholder="Должность" /></div><div class="col-sm-5"><input data-name="position-name" type="text" class="form-control add-input-pos-name" placeholder="Имя" /></div><div class="col-sm-2">
      <button
        class="btn btn-danger btn-sm btn-remove-field"
        type="button"
      >
        <svg
          class="octicon octicon-x"
          viewBox="0 0 14 18"
          version="1.1"
          width="14"
          height="18"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
          ></path>
        </svg>
      </button>
    </div>`;
      $parent.append(div);
    }
    if (e.target.closest(".btn-remove-field")) {
      let $parentDiv = e.target.closest(".form-group");
      if ($parentDiv.classList.contains("addPosition")) {
        $parentDiv.remove();
      }
    }
  });
}
// Сохранение файла из модалки в base64

function previewFile() {
  let fileInput = document.getElementById("upload-poster");
  let file = fileInput.files[0];
  let reader = new FileReader();

  reader.onloadend = function () {
    let res = reader.result;
    let pic = [];

    pic.push({
      value: JSON.stringify(res),
    });

    localStorage.file = JSON.stringify(pic);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Страница "Все фильмы"

function printFilms() {
  let $main = document.querySelector("main");
  $main.innerHTML = "";

  let localArrFilms = localStorage.films ? JSON.parse(localStorage.films) : [];

  localArrFilms.forEach(function (film) {
    let data = {
      name: film.name,
      description: film.description,
      rating: film.rating,
      poster: film.poster,
      id: film.id,
    };

    fetch("./card.html")
      .then((res) => res.text())
      .then((tpl) => {
        template(data, tpl);

        $main.innerHTML += template(data, tpl);
        cardEditDelete();
      });

    function template(data, tpl) {
      const f = (strings, ...values) =>
        strings.reduce((res, item, index) => {
          return index === strings.length - 1
            ? (res += `${item}`)
            : (res += `${item}${data[values[index]]}`);
        }, "");
      return eval("f`" + tpl + "`");
    }
  });
}

// В карточке фильма из списка "Все фильмы" кнопки "удалить" и "редактировать"

function cardEditDelete() {
  let arrCard = document.querySelectorAll(".card");

  arrCard.forEach(function (card) {
    card.addEventListener("click", function (e) {
      let localArrFilms = JSON.parse(localStorage.films);

      if (e.target.closest(".btn-edit")) {
        function wrapperCard(url) {
          getAddNewHTML(url)
            .then((res) => res.text())
            .then((data) => {
              document.body.innerHTML += data;
              addDeletePosition(data);
              previewFile(data);

              let $modal = document.getElementById("modalNew");
              let $modalInput = $modal.querySelectorAll("input");
              let $modalTextarea = $modal.querySelectorAll("textarea");
              $($modal).modal("show");
              let btn = e.target.closest(".btn-edit");
              let idCard = +btn.dataset.id;

              localArrFilms.forEach(function (localFilm, index) {
                if (localFilm.id === idCard) {
                  let localPoster = localFilm.poster;

                  if (localFilm.positionAll) {
                    let $parent = document.querySelector("fieldset");
                    let lastTpl = $parent.lastElementChild;
                    lastTpl.remove();

                    for (let key in localFilm.positionAll) {
                      let div = document.createElement("div");
                      div.className = "addPosition form-group row";
                      div.innerHTML = `<div class="col-sm-5"><input data-name="position" type="text" class="form-control add-input-pos" placeholder="Должность" /></div><div class="col-sm-5"><input data-name="position-name" type="text" class="form-control add-input-pos-name" placeholder="Имя" /></div><div class="col-sm-2">
                      <button
                        class="btn btn-danger btn-sm btn-remove-field"
                        type="button"
                      >
                        <svg
                          class="octicon octicon-x"
                          viewBox="0 0 14 18"
                          version="1.1"
                          width="14"
                          height="18"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
                          ></path>
                        </svg>
                      </button>
                    </div>`;
                      $parent.append(div);
                      let last = $parent.lastElementChild;
                      let inpPos = last.querySelectorAll("input");
                      inpPos[0].value = key;
                      inpPos[1].value = localFilm.positionAll[key];
                    }
                  }

                  $modalInput.forEach(function (item, index) {
                    if (item.dataset.name === "poster") {
                      item.value = "";
                    } else {
                      let nameInd = item.dataset.name;
                      item.value = localFilm[nameInd];
                    }
                  });

                  $modalTextarea.forEach(function (item, index) {
                    let nameInd = item.dataset.name;
                    item.value = localFilm[nameInd];
                  });

                  saveChange(data, idCard, localPoster);
                }
              });

              $("#modalNew").on("hidden.bs.modal", function () {
                $modal.remove();
                wrapper("./add-new.html");
                search();
                allMovies();
              });
            });
        }

        wrapperCard("./add-new.html");
      }

      if (e.target.closest(".btn-delete")) {
        let btn = e.target.closest(".btn-delete");
        let idCard = +btn.dataset.id;

        localArrFilms.forEach(function (localFilm, index) {
          if (localFilm.id === idCard) {
            localArrFilms.splice(index, 1);
            localStorage.films = JSON.stringify(localArrFilms);
            localStorage.removeItem(idCard);
            printFilms();
          }
        });
      }
      if (e.target.closest(".more")) {
        let btn = e.target.closest(".more");
        let src = btn.href;
        let idFilm = src.slice(src.indexOf("-") + 1);

        filmInfo(idFilm);
      }
    });
  });
}

// Редактирование и сохранение данных из модалки в localStorage

function saveChange(data, id, poster) {
  let $btnSave = document.getElementById("modal_submite");
  let argId = id;
  let argPoster = poster;

  $btnSave.addEventListener("click", function (e) {
    let $modal = document.getElementById("modalNew");
    let arrInputs = $modal.querySelectorAll("input");
    let arrTextarea = $modal.querySelectorAll("textarea");
    let arrPos = $modal.querySelectorAll(".add-input-pos");
    let arrPosName = $modal.querySelectorAll(".add-input-pos-name");
    let list = localStorage.films ? JSON.parse(localStorage.films) : [];

    let obj = {
      id: argId,
      poster: argPoster,
    };

    list.forEach(function (item, index) {
      if (item.id === obj.id) {
        Object.assign(obj, item);
      }
    });

    arrInputs.forEach(function (item) {
      obj[item.dataset.name] = item.value;
    });
    arrTextarea.forEach(function (item) {
      obj[item.dataset.name] = item.value;
    });

    let objPos = {};

    arrPos.forEach(function (item, index) {
      delete obj.positionAll;
      delete obj[item.dataset.name];
      delete obj[arrPosName[index].dataset.name];
      objPos[item.value] = arrPosName[index].value;
    });

    obj.positionAll = objPos;

    let localArr = localStorage.file ? JSON.parse(localStorage.file) : null;

    if (localArr === null) {
      obj.poster = argPoster;
    } else {
      obj.poster = localArr[0].value;
    }

    list.forEach(function (item, index) {
      if (item.id === obj.id) {
        list.splice(index, 1, obj);
      }
    });

    localStorage.films = JSON.stringify(list);
    localStorage[obj.id] = JSON.stringify(obj);

    localStorage.removeItem("file");

    let $modalBgColor = document.querySelector(".modal-backdrop");

    $modal.remove();
    $modalBgColor.remove();

    search();
    allMovies();
    wrapper("./add-new.html");
  });
}

// Страница "Подробнее"***************************************************

function filmInfo(id) {
  getAddNewHTML("./movie.html")
    .then((res) => res.text())
    .then((data) => {
      let tpl = data;

      let localArrFilms = JSON.parse(localStorage.films);

      let dataMovie = {};

      localArrFilms.forEach(function (localFilm) {
        if (localFilm.id === +id) {
          for (let key in localFilm) {
            dataMovie[key] = localFilm[key];
          }
        }
      });

      let arrActors = dataMovie.actors.split(", ");

      let accStr = "";

      arrActors.forEach(function (actor) {
        accStr += `<li>${actor}</li>`;
      });

      dataMovie.actors = accStr;

      let $main = document.querySelector("main");
      $main.innerHTML = "";
      $main.innerHTML += template(dataMovie, tpl);
      if (dataMovie.positionAll) {
        let ul = document.querySelector("ul.movie-info.pl-0");
        for (let key in dataMovie.positionAll) {
          let li = document.createElement("li");
          li.className = "d-flex";
          li.innerHTML = `<p class="col-3">${key}</p>
          <p class="col-9">${dataMovie.positionAll[key]}</p>`;
          ul.append(li);
        }
      }

      function template(data, tpl) {
        const f = (strings, ...values) =>
          strings.reduce((res, item, index) => {
            return index === strings.length - 1
              ? (res += `${item}`)
              : (res += `${item}${data[values[index]]}`);
          }, "");
        return eval("f`" + tpl + "`");
      }
    });
}

// ПОИСК*******************************************************

function search() {
  let $formSearch = document.getElementById("search");

  $formSearch.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });

  $formSearch.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.closest(".search.btn")) {
      window.location.hash = "#search";

      let btn = e.target.closest(".search.btn");
      let input = btn.previousElementSibling;

      let query = input.value.toLowerCase();

      let localArr = localStorage.films ? JSON.parse(localStorage.films) : null;

      let arrSearch = [];

      localArr.forEach(function (localFilm) {
        let str = localFilm.name.toLowerCase();
        if (str.includes(query)) {
          arrSearch.push(localFilm);
        }
      });

      input.value = "";

      localStorage.arrSearch = JSON.stringify(arrSearch);

      printFilmsSearch();

      function printFilmsSearch() {
        let $main = document.querySelector("main");
        $main.innerHTML = "";

        let localArrFilms = localStorage.arrSearch
          ? JSON.parse(localStorage.arrSearch)
          : [];

        localArrFilms.forEach(function (film) {
          let data = {
            name: film.name,
            description: film.description,
            rating: film.rating,
            poster: film.poster,
            id: film.id,
          };

          fetch("./card.html")
            .then((res) => res.text())
            .then((tpl) => {
              template(data, tpl);

              $main.innerHTML += template(data, tpl);
              cardEditDelete();
            });

          function template(data, tpl) {
            const f = (strings, ...values) =>
              strings.reduce((res, item, index) => {
                return index === strings.length - 1
                  ? (res += `${item}`)
                  : (res += `${item}${data[values[index]]}`);
              }, "");
            return eval("f`" + tpl + "`");
          }
        });
      }

      localStorage.removeItem("arrSearch");
    }
  });
}

search();

// Клик на "все фильмы"

function allMovies() {
  document
    .querySelector("a.nav-link.all-movies")
    .addEventListener("click", function () {
      let $main = document.querySelector("main");
      $main.innerHTML = "";
      printFilms();
    });
}

allMovies();
