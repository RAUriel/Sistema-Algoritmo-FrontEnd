import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmeansComponent } from './kmeans.component';

describe('KmeansComponent', () => {
  let component: KmeansComponent;
  let fixture: ComponentFixture<KmeansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KmeansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KmeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
