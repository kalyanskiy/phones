var contactIndex = 0; // переменная для хранения индекса контактов
var contacts = []; // массив для хранения объектов контактов
var isPageLoaded = false; // переменная для отслеживания завершения загрузки страницы

window.onload = function () {
  loadContacts(); // загрузка контактов из localStorage при загрузке страницы
  isPageLoaded = true; // установка  загрузки страницы в true,состояние загрузки страницы
};

function openEditor() {
  if (isPageLoaded) {
    // проверяется, загружена ли страница

    document.getElementById("editorModal").style.display = "block"; // показать модальное окно редактора
  }
}

function closeEditor() {
  document.getElementById("editorModal").style.display = "none"; // скрытие модального окна редактора
  clearEditorFields(); // очистить поля редактора
}

function saveContact() {
  var name = document.getElementById("nameInput").value; // получение значение поля ввода имени
  var phone = document.getElementById("phoneInput").value; // получение значение поля ввода телефона
  var type = document.getElementById("typeSelect").value; // получение выбранное значение типа контакта

  var contact = {
    index: contactIndex,
    name: name,
    phone: phone,
    type: type,
  }; // создание объекта контакт

  contacts.push(contact); // добавление контакта в массив
  addContactToTable(contact); // добавление контакта в таблицу
  contactIndex++; // увеличение индекса контакта
  saveContacts(); // сохранение контактов

  closeEditor(); // закрытие редактора
}

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts)); // сохранение контактов в localStorage
  localStorage.setItem("contactIndex", contactIndex.toString()); // сохранение индекса контакта в localStorage
}

function loadContacts() {
  var savedContacts = localStorage.getItem("contacts"); // получение сохраненных контактов из localStorage
  var savedContactIndex = localStorage.getItem("contactIndex"); // получение сохраненного индекса контакта из localStorage

  if (savedContacts && savedContactIndex) {
    contacts = JSON.parse(savedContacts); // преобразование сохраненных контактов в объекты JS
    contactIndex = parseInt(savedContactIndex); // преобразование сохраненного индекса контакта в число
    repopulateContactTable(); // перезаполнение таблицы контактов
  } else {
    contacts = []; // инициализация пустого массива контактов
    if (contacts.length === 0) {
      contactIndex = 1; // если массив контактов пуст, установить индекс контакта в 1
    }
  }
}

function openEditModal() {
  if (isPageLoaded && contacts.length > 0) {
    // проверить, загружена ли страница и есть ли контакты
    var selectElement = document.getElementById("editContactSelect");
    selectElement.innerHTML = "";

    for (var i = 0; i < contacts.length; i++) {
      var option = document.createElement("option"); //этот элемент представляет вариант выбора внутри выпадающего списка.
      option.value = contacts[i].index; //эта строка устанавливает значение атрибута value для элемента option.
      option.textContent = contacts[i].name; //эта строка устанавливает текстовое содержимое для элемента option.
      selectElement.appendChild(option); //добавляем созданный элемент option в элемент select с помощью метода appendChild(), selectElement представляет собой ссылку на элемент select с идентификатором "editContactSelect".
    }

    document.getElementById("editModal").style.display = "block";
  }
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  clearEditFields();
}

function updateContact() {
  var selectedIndex = document.getElementById("editContactSelect").value; // получение выбранного индекса контакта
  var contact = getContactByIndex(selectedIndex); // получение контакта по выбранному индексу

  if (contact) {
    var newName = document.getElementById("editNameInput").value; // получение нового значения имени
    var newPhone = document.getElementById("editPhoneInput").value; // получение нового значения телефона
    var newType = document.getElementById("editTypeSelect").value; // получение нового значения типа контакта

    contact.name = newName; // обновление имя контакта
    contact.phone = newPhone; // обновление телефона контакта
    contact.type = newType; // обновление типа контакта

    saveContacts(); // сохранение контактов

    closeEditModal(); // закрытие модального окна редактирования
    repopulateContactTable(); // перезаполнение таблицы контактов
  }
}

function openDeleteModal() {
  if (isPageLoaded) {
    var selectElement = document.getElementById("deleteContactSelect");
    selectElement.innerHTML = "";

    for (var i = 0; i < contacts.length; i++) {
      var option = document.createElement("option");
      option.value = contacts[i].index;
      option.textContent = contacts[i].name;
      selectElement.appendChild(option);
    }

    document.getElementById("deleteModal").style.display = "block";
  }
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function deleteContact() {
  var selectedIndex = document.getElementById("deleteContactSelect").value; // получение выбранного индекса контакта
  var contact = getContactByIndex(selectedIndex); // получение контакта по выбранному индексу

  if (contact) {
    removeContactFromTable(contact); // удаление контакта из таблицы
    contacts = contacts.filter(function (item) {
      return item.index !== contact.index;
    }); // фильтрация контактов и удаление выбранного контакта
    repopulateContactTable(); // перезаполнение таблицы контактов
    saveContacts(); // сохранение контактов после удаления контакта
    closeDeleteModal(); // закрытие модального окна удаления
  }
}

function sortContacts() {
  contacts.sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // преобразование имени A в верхний регистр для сравнения
    var nameB = b.name.toUpperCase(); // преобразование имени B в верхний регистр для сравнения

    if (nameA < nameB) {
      return -1; // вернуть -1, если имя A меньше имени B,  контакт а должен быть расположен после контактом b в отсортированном массиве.
    } else if (nameA > nameB) {
      return 1; // вернуть 1, если имя A больше имени B,  контакт a должен быть расположен перед контактом b в отсортированном массиве.
    } else {
      return 0; // вернуть 0, если имена равны
    }
  });

  clearContactTable(); // очистить таблицу контактов
  repopulateContactTable(); // перезаполнение таблицы контактов
}

function getContactByIndex(index) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].index === parseInt(index)) {
      return contacts[i]; // нахождение и возвращение контакта по индексу
    }
  }
  return null; // вернуть null, если контакт не найден
}

function addContactToTable(contact) {
  var contactTable = document.getElementById("contactTable");
  var index = contactTable.rows.length; // получить количество строк, включая строку заголовка

  var contactRow = document.createElement("tr");
  var indexCell = document.createElement("td");
  var nameCell = document.createElement("td");
  var phoneCell = document.createElement("td");
  var typeCell = document.createElement("td");

  indexCell.textContent = index; // установление значения ячейки индекса
  nameCell.textContent = contact.name; // установление значения ячейки имени
  phoneCell.textContent = contact.phone; // установление значения ячейки телефона
  typeCell.textContent = contact.type; //установление значения ячейки типа контакта

  contactRow.appendChild(indexCell);
  contactRow.appendChild(nameCell);
  contactRow.appendChild(phoneCell);
  contactRow.appendChild(typeCell);

  contactTable.appendChild(contactRow); // добавление строки контакта в таблицу
}

function removeContactFromTable(contact) {
  //данная функция удаляет контакт из таблицы контактов, удаляя его строку из таблицы.
  var table = document.getElementById("contactTable");
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (
      cells.length > 0 &&
      parseInt(cells[0].textContent) === parseInt(contact.index)
    ) {
      table.deleteRow(i); // удаление строки контакта из таблицы
      break;
    }
  }
}

function clearContactTable() {
  //эта функция очищает таблицу контактов, удаляя все строки и контакты из таблицы.
  var table = document.getElementById("contactTable");
  var rowCount = table.rows.length;

  for (var i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i); // удаление всех строк, кроме строки заголовка
  }
}

function repopulateContactTable() {
  //данная функция перезаполняет таблицу контактов, загружая контакты из массива контактов и отображая их в таблице.
  clearContactTable(); // очистить таблицу контактов

  for (var i = 0; i < contacts.length; i++) {
    addContactToTable(contacts[i]); // добавление каждого контакта в таблицу
  }
}

function clearEditorFields() {
  document.getElementById("nameInput").value = ""; // очистить поле ввода имени
  document.getElementById("phoneInput").value = ""; // очистить поле ввода телефона
  document.getElementById("typeSelect").value = ""; // очистить выбранное значение типа контакта
  document.getElementById("townInput").value = ""; // очистить выбранное значение типа контакта
}

function clearEditFields() {
  document.getElementById("editNameInput").value = ""; // очистить поле ввода имени редактирования
  document.getElementById("editPhoneInput").value = ""; // очистить поле ввода телефона редактирования
  document.getElementById("editTypeSelect").value = ""; // очистить выбранное значение типа контакта редактирования
  document.getElementById("editTownInput").value = ""; // очистить выбранное значение типа контакта редактирования
}

function openSortModal() {
  if (isPageLoaded) {
    document.getElementById("sortModal").style.display = "block"; // Показать модальное окно сортировки
  }
}

function closeSortModal() {
  document.getElementById("sortModal").style.display = "none"; // Скрыть модальное окно сортировки
}
