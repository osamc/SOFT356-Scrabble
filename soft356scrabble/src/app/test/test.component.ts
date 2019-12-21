import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
  simpleGet(url:string) {
    var xmlHttp = new XMLHttpRequest();
   
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.setRequestHeader('Acess-Control-Allow-Origin', '*');
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
  }


}
