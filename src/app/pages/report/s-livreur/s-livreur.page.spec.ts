import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SLivreurPage } from './s-livreur.page';

describe('SLivreurPage', () => {
  let component: SLivreurPage;
  let fixture: ComponentFixture<SLivreurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SLivreurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SLivreurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
