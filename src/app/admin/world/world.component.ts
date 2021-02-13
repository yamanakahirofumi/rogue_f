import { Component, OnInit } from '@angular/core';
import {FieldsAccessService} from '../../fields/service/fields-access.service';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {

  data;

  constructor(private access: FieldsAccessService) { }

  ngOnInit(): void {
    this.access.getDungeonInfo(1).subscribe(it => this.data = it);
  }

}
