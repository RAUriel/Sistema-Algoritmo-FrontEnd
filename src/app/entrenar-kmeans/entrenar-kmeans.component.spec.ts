import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenarKmeansComponent } from './entrenar-kmeans.component';

describe('EntrenarKmeansComponent', () => {
  let component: EntrenarKmeansComponent;
  let fixture: ComponentFixture<EntrenarKmeansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntrenarKmeansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenarKmeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
