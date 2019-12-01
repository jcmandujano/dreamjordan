import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TourDetailPage } from './tour-detail.page';

describe('TourDetailPage', () => {
  let component: TourDetailPage;
  let fixture: ComponentFixture<TourDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TourDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
