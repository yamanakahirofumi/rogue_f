import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage.service';
import {FieldsAccessService} from '../../service/fields-access.service';
import {filter, mergeMap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements AfterViewInit {

  @ViewChild('name') name: ElementRef;

  constructor(private router: Router, private access: FieldsAccessService, private storageService: StorageService) {
  }

  ngAfterViewInit(): void {
    this.name.nativeElement.focus();
  }

  fixedName(name: string): void {
    this.access.exist(name).pipe(filter(it => !it),
      mergeMap(() => this.access.create(name)),
      mergeMap(it => {
        this.storageService.set('playerId', String(it));
        return this.access.gotoDungeon(it);
      }))
      .subscribe(it => {
        this.storageService.set('playerName', name);
        this.router.navigate(['/play']);
      });
  }

}
