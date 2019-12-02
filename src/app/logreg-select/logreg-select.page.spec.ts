import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogregSelectPage } from './logreg-select.page';

describe('LogregSelectPage', () => {
  let component: LogregSelectPage;
  let fixture: ComponentFixture<LogregSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogregSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogregSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
