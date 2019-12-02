import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DreamjordanPlansPage } from './dreamjordan-plans.page';

describe('DreamjordanPlansPage', () => {
  let component: DreamjordanPlansPage;
  let fixture: ComponentFixture<DreamjordanPlansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreamjordanPlansPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DreamjordanPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
