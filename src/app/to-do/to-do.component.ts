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


  // load the items that the user has not deleted into the user interface
  // When the user deletes an item nothing is removed from the toDoList array just the trash flag is set
  loadList(array: any[]) {
    // see https://stackoverflow.com/q/43724426/55640  
    array.forEach((item) => {
      if (!item.trash) {
        this.addToDo(item.name, item.id, item.done, item.trash);
      }      
    });

  }
  
  // Display the todo list
  addToDo(toDo: string, id: number, done: boolean, trash: boolean) {        
    const { tick, strikeThrough } = this.formatCompletedItem(done);

    const text = this.toDoliElement(tick, id, strikeThrough, toDo);
    
    this.displayToDoItemOnPage(text);  
  }

  
  // completed items are displayed with a tick and strikethrough
  private formatCompletedItem(done: boolean) {
    const tick = done ? this.check : this.uncheck;

    const strikeThrough = done ? this.line_through : "";
    
    return { tick, strikeThrough };
  }
  
  // Return a HTML li element containing the to do item, the tick and strikethrough attributes 
  // are set if the to do has been completed
  private toDoliElement(tick: string, id: number, strikeThrough: string, toDo: string) {
    return `<li class="item">
                     <i class="fa ${tick} co" job="complete" id="${id}"></i>
                     <p class="text ${strikeThrough}"> ${toDo}</p>
                     <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>`;
  }
  
  // Insert the new item at the bottom of the UL element
  private displayToDoItemOnPage(text: string) {    
    const position = "beforeend";
    
    const toDolistPosition = document.getElementById("list");
    
    toDolistPosition.insertAdjacentHTML(position, text);
  }

  // add or removes the styles used to show if the to do item is complete 
  toggleComplete(element: HTMLElement) {

    element.classList.toggle(this.check);

    element.classList.toggle(this.uncheck);

    element.parentNode.querySelector(".text").classList.toggle(this.line_through);

    this.toDoList[element.id].done = this.toDoList[element.id].done ? false : true;      

  }
  
  // when the user deletes a to do item, the item is not removed from the list
  // but the trash property is set to true which stops it from being displayed
  removeToDoItem(element: HTMLElement) {

    element.parentNode.parentNode.removeChild(element.parentNode);

    this.toDoList[element.id].trash = true;          
    
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
      this.toggleComplete(element);    
      this.addToLocalStorage();
    } else if (elementJOB == "delete") {
      this.removeToDoItem(element);      
      this.addToLocalStorage();
    }
  }

  // Create a new to do item when the user presses the enter key
  addAToDo(event: KeyboardEvent) {

    const enterKey = 13;

    if (event.keyCode == enterKey) {      
      // get the the new to do item
      let toDoItem = (<HTMLInputElement>document.getElementById("input")).value;          
      // If the user has entered something call the methods to display this item 
      // and add it to the list of to do items
      if (toDoItem) {
        this.addToDo(toDoItem, this.toDoID, false, false);
        this.toDoList.push(
          {
            name: toDoItem,
            id: this.toDoID,
            done: false,
            trash: false
          }
        );
        this.addToLocalStorage();
        this.toDoID++;
      }
      (<HTMLInputElement>document.getElementById("input")).value = '';
    }
  }
  
  // save the updated list of to do items to the browsers storage
  private addToLocalStorage() {
    localStorage.setItem("TODO", JSON.stringify(this.toDoList));
  }

  // called the button that looks like a refresh button (not the browser refresh button)
  clearLocalStorage() {
    localStorage.clear();
    location.reload();
  }

}
