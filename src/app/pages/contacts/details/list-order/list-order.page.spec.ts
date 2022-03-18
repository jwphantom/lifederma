import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListOrderPage } from './list-order.page';

describe('ListOrderPage', () => {
  let component: ListOrderPage;
  let fixture: ComponentFixture<ListOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
