import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPokemon } from './nuevo-pokemon';

describe('NuevoPokemon', () => {
  let component: NuevoPokemon;
  let fixture: ComponentFixture<NuevoPokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPokemon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoPokemon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
