import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponValidatorPage } from './coupon-validator.page';

describe('CouponValidatorPage', () => {
  let component: CouponValidatorPage;
  let fixture: ComponentFixture<CouponValidatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponValidatorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponValidatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
