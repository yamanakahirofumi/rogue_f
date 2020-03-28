import {Component, OnInit} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {

  constructor(private access: FieldsAccessService) {
  }

  fieldMap: string[][];

  ngOnInit(): void {
    this.access.get().subscribe(it => this.fieldMap = it);
  }

}
