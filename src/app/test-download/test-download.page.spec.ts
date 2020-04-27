import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestDownloadPage } from './test-download.page';

describe('TestDownloadPage', () => {
  let component: TestDownloadPage;
  let fixture: ComponentFixture<TestDownloadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDownloadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDownloadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
