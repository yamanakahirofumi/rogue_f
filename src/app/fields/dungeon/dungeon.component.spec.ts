import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DungeonComponent } from './dungeon.component';

describe('DungeonComponent', () => {
  let component: DungeonComponent;
  let fixture: ComponentFixture<DungeonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DungeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DungeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
