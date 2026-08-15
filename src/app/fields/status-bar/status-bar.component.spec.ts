import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set second property correctly', () => {
    component.second = 2.5;
    expect(component.second).toBe(2.5);

    component.second = -1;
    expect(component.second).toBe(0);
  });

  it('should calculate currentWidth correctly when value and maxValue change', () => {
    component.maxValue = 200;
    component.value = 50;
    expect(component.currentWidth).toBe(25);

    component.value = 250;
    expect(component.currentWidth).toBe(100);

    component.value = -10;
    expect(component.currentWidth).toBe(0);
  });

  it('should handle changeFlg reset and animation sequence', fakeAsync(() => {
    component.maxValue = 100;
    component.value = 80;

    component.changeFlg = true;
    expect(component.changeFlg).toBeTrue();
    expect(component.isTransitioning).toBeFalse();
    expect(component.currentWidth).toBe(0);

    tick(0);
    fixture.detectChanges();

    expect(component.isTransitioning).toBeTrue();
    expect(component.currentWidth).toBe(100);

    component.onTransitionEnd();
    expect(component.changeFlg).toBeFalse();
  }));
});
