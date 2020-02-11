import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FAQsPage } from './faqs.page';

describe('FAQsPage', () => {
  let component: FAQsPage;
  let fixture: ComponentFixture<FAQsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FAQsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
