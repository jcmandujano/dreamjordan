import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DreamjordanDetailPage } from './dreamjordan-detail.page';

describe('DreamjordanDetailPage', () => {
  let component: DreamjordanDetailPage;
  let fixture: ComponentFixture<DreamjordanDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreamjordanDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DreamjordanDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
