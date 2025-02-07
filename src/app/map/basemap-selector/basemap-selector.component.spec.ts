import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasemapSelectorComponent } from './basemap-selector.component';

describe('BasemapSelectorComponent', () => {
  let component: BasemapSelectorComponent;
  let fixture: ComponentFixture<BasemapSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasemapSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasemapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
