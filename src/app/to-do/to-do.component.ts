import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  clear: HTMLElement;
  dateElement: HTMLElement;
  list: HTMLElement; 
  // input: HTMLElement;

  CHECK = "fa-check-circle";
  UNCHECK = "fa-circle-thin";
  LINE_THROUGH = "lineThrough";

  LIST = [];
  id: number;
  data;

  constructor() { }

  

  ngOnInit(): void {
    
    this.clear = document.querySelector(".clear");
    this.dateElement = document.getElementById("date");
    this.list = document.getElementById("list");
    // this.input = document.getElementById("input");

    // show todays date
    const options = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();
    this.dateElement.innerHTML = today.toLocaleDateString("en-UK", options);

    this.data = localStorage.getItem("TODO");

    if (this.data) {
      this.LIST = JSON.parse(this.data);
      this.id = this.LIST.length; // set the id to the last one in the list
      this.loadList(this.LIST);
    } else {
      this.LIST = [];
      this.id = 0;
    }
  }

  // load the items into the user interface
  loadList(array) {
    // see https://stackoverflow.com/q/43724426/55640  
    array.forEach((item) => {      
      this.addToDo(item.name, item.id, item.done, item.trash);
    });
    
  }

  // called the button that looks like a refresh button (not the browser refresh button)
  clearLocalStorage() {
    localStorage.clear();
    location.reload();
  }

  addToDo(toDo, id, done, trash) {

    if (trash) {
      return;
    }

    const DONE = done ? this.CHECK : this.UNCHECK;

    const LINE = done ? this.LINE_THROUGH : "";

    const text = `<li class="item">
                     <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                     <p class="text ${LINE}"> ${toDo}</p>
                     <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>`;

    const position = "beforeend";
    this.list.insertAdjacentHTML(position, text);
  }

  completeToDo(element) {
    element.classList.toggle(this.CHECK);
    element.classList.toggle(this.UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(this.LINE_THROUGH);
    this.LIST[element.id].done = this.LIST[element.id].done ? false : true;
  }

  removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    this.LIST[element.id].trash = true;
  }

  todoListControls(event) {    
    let element = event.target;
    
    let elementJOB = element.attributes.job.value; // delete or complete

    if (elementJOB == "complete") {
      this.completeToDo(element);
    } else if (elementJOB == "delete") {
      this.removeToDo(element)
    }
    // add item to local storage
    localStorage.setItem("TODO", JSON.stringify(this.LIST));
  }


  newTodoItem(event) {    
    if (event.keyCode == 13) {
      
      let input = (<HTMLInputElement>document.getElementById("input")).value;      
      const toDo = input;
      
      // call addToDo if the input field has something in it...
      if (toDo) {
        this.addToDo(toDo, this.id, false, false);
        this.LIST.push(
          {
            name: toDo,
            id: this.id,
            done: false,
            trash: false
          }
        );
        // add this item to local storage
        localStorage.setItem("TODO", JSON.stringify(this.LIST));
        this.id++;        
      }
      (<HTMLInputElement>document.getElementById("input")).value = '';
    }
  }

}
