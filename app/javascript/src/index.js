import $ from "jquery";

import {
  indexTasks,
  postTask,
  removeTask,
  markComplete,
  markActive,
} from "./requests.js";

$(document).ready(function () {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.toLocaleString("default", { month: "long" });
  let day = date.getDate();
  let dayWeek = date.toLocaleString("default", { weekday: "long" });

  $(".date-container").append(
    `<div class="date"><div class="date-left"><span>${day}</span> <h2>${month} <br> ${year}</h2></div><div class="date-right">${dayWeek}</div></div>`
  );

  indexTasks(function (response) {
    displayTasks(response.tasks);
  });

  function displayTasks(tasks) {
    $("#todo-list").empty();
    $(".status-list li").removeClass("border-bottom");
    $(".status-list li:not(:first-child)").addClass("border-bottom");
    tasks.map(function (task) {
      $("#todo-list").append(
        "<div class='todo-item'><input type='checkbox' class='checkbox' data-id='" +
          task.id +
          "'" +
          (task.completed ? "checked" : "") +
          "><p class='item'>" +
          task.content +
          "</p> <i class='fa-solid fa-trash btn-delete' data-id=" +
          task.id +
          "></i></div>"
      );
    });
  }

  $("#input").on("keyup", function (e) {
    e.preventDefault();
    let input = $("#input").val();
    if (e.key === "Enter") {
      if (input) {
        postTask(input);
        $("#input").val("");
        indexTasks((response) => {
          displayTasks(response.tasks);
        });
      }
    }
  });

  $(document).on("click", ".btn-delete", function () {
    removeTask($(this).data("id"));
    indexTasks((response) => {
      displayTasks(response.tasks);
    });
  });

  $(document).on("change", ".checkbox", function () {
    if (this.checked) {
      markComplete($(this).data("id"));
    } else {
      markActive($(this).data("id"));
    }
  });

  $(".btn-completed").on("click", function () {
    indexTasks((response) => {
      let filteredTasks = response.tasks.filter((task) => task.completed);
      filteredTasks.sort(function (a, b) {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      });
      displayTasks(filteredTasks);
    });

    $(".status-list li").removeClass("border-bottom");
    $(".status-list li:not(:last-child)").addClass("border-bottom");
  });

  $(".btn-all").on("click", function () {
    indexTasks((response) => {
      displayTasks(response.tasks);
    });
    $(".status-list li").removeClass("border-bottom");
    $(".status-list li:not(:first-child)").addClass("border-bottom");
  });

  $(".btn-active").on("click", function () {
    indexTasks((response) => {
      let filteredTasks = response.tasks.filter((task) => !task.completed);
      filteredTasks.sort(function (a, b) {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      });
      displayTasks(filteredTasks);
    });

    $(".status-list li").removeClass("border-bottom");
    $(".status-list li:not(:nth-child(2))").addClass("border-bottom");
  });
});
