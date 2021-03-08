import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AidePage } from './aide.page';

describe('AidePage', () => {
  let component: AidePage;
  let fixture: ComponentFixture<AidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
