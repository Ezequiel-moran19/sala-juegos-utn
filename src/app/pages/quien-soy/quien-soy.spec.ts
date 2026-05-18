import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuienSoy } from './quien-soy';
import { provideHttpClient } from '@angular/common/http';

describe('QuienSoy', () => {
  let component: QuienSoy;
  let fixture: ComponentFixture<QuienSoy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuienSoy],
      providers: [provideHttpClient()] // ✔ VA ACÁ
    }).compileComponents();

    fixture = TestBed.createComponent(QuienSoy);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ✔ importante
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});