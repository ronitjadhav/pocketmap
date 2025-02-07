import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthWidgetComponent } from './auth-widget.component';

describe('AuthWidgetComponent', () => {
  let component: AuthWidgetComponent;
  let fixture: ComponentFixture<AuthWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
