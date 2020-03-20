import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  check = "fa-check-circle";
  uncheck = "fa-circle-thin";
  line_through = "lineThrough";

  toDoList: { name: string; id: number; done: boolean; trash: boolean; }[];
  toDoID: number;
  
  constructor() { }

  ngOnInit(): void {

    this.displayDate();

    this.loadToDoList();
  }

  // Display the date such as Friday, Mar 20, 2020
  private displayDate() {

    const options = { weekday: "long", month: "short", day: "numeric", year: "numeric" };

    const today = new Date();

    (<HTMLElement>document.getElementById("date")).innerHTML = today.toLocaleDateString("en-UK", options);

  }

  // recall the todo list if anything is found in the browsers local storage
  // otherwise set up the variables for a new todo list
  private loadToDoList() {

    const data = localStorage.getItem("TODO");

    if (data) {
      this.toDoList = JSON.parse(data);
      this.toDoID = this.toDoList.length; // set the id to the last one in the list
      this.loadList(this.toDoList);
    }
    else {
      this.toDoList = [];
      this.toDoID = 0;
    }
  }


  // load the items into the user interface
  loadList(array: any[]) {
    // see https://stackoverflow.com/q/43724426/55640  
    array.forEach((item) => {
      this.addToDo(item.name, item.id, item.done, item.trash);
    });

  }
  
  // needs refactoring
  addToDo(toDo: string, id: number, done: boolean, trash: boolean) {

    if (trash) {
      return;
    }

    const DONE = done ? this.check : this.uncheck;

    const LINE = done ? this.line_through : "";

    const text = `<li class="item">
                     <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                     <p class="text ${LINE}"> ${toDo}</p>
                     <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>`;

    const position = "beforeend";
    const toDolistPosition = document.getElementById("list");
    toDolistPosition.insertAdjacentHTML(position, text);
  }
  
  // needs refactoring
  completeToDo(element: HTMLElement) {

    element.classList.toggle(this.check);

    element.classList.toggle(this.uncheck);

    element.parentNode.querySelector(".text").classList.toggle(this.line_through);

    this.toDoList[element.id].done = this.toDoList[element.id].done ? false : true;

    // update the local storage to reflect that the item has been marked as complete
    localStorage.setItem("TODO", JSON.stringify(this.toDoList));

  }
    
  removeToDo(element: HTMLElement) {

    element.parentNode.parentNode.removeChild(element.parentNode);

    this.toDoList[element.id].trash = true;

    // update the local storage to reflect that the item has been deleted
    localStorage.setItem("TODO", JSON.stringify(this.toDoList));

  }

  // Handles when a user completes or deletes a todo item  
  todoListControls(event: MouseEvent) {

    // get the element which the user clicked on
    const element = event.target as HTMLUListElement;

    // the value of the job attribute. 
    // This attribute is created by the method addToDo and can have the value
    // complete or delete          
    const elementJOB = element.attributes[1].value;

    // route what the user has selected to the appropriate method
    if (elementJOB == "complete") {
      this.completeToDo(element);
    } else if (elementJOB == "delete") {
      this.removeToDo(element)
    }
  }

  // needs further refactoring
  newTodoItem(event) {
    if (event.keyCode == 13) {

      let input = (<HTMLInputElement>document.getElementById("input")).value;
      const toDo = input;

      // call addToDo if the input field has something in it...
      if (toDo) {
        this.addToDo(toDo, this.toDoID, false, false);
        this.toDoList.push(
          {
            name: toDo,
            id: this.toDoID,
            done: false,
            trash: false
          }
        );
        // add this item to local storage
        localStorage.setItem("TODO", JSON.stringify(this.toDoList));
        this.toDoID++;
      }
      (<HTMLInputElement>document.getElementById("input")).value = '';
    }
  }

  // called the button that looks like a refresh button (not the browser refresh button)
  clearLocalStorage() {
    localStorage.clear();
    location.reload();
  }

}
