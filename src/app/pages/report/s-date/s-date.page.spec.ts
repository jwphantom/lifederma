import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SDatePage } from './s-date.page';

describe('SDatePage', () => {
  let component: SDatePage;
  let fixture: ComponentFixture<SDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SDatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
