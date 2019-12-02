import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LangSelecPage } from './lang-selec.page';

describe('LangSelecPage', () => {
  let component: LangSelecPage;
  let fixture: ComponentFixture<LangSelecPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangSelecPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LangSelecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
