import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { PokedexPage } from './pokedex-page';
import { PokemonService } from '../../../core/pokemon.service';
import { Pokemon } from '../../../core/pokemon.model';

describe('PokedexPage', () => {
  let component: PokedexPage;
  let fixture: ComponentFixture<PokedexPage>;
  let pokemonServiceMock: any;
  let pokemonsSubject: BehaviorSubject<Pokemon[]>;

  const pikachuMock: Pokemon = {
    id: 1,
    nombre: 'Pikachu',
    tipo: 'Eléctrico',
    imagen: 'pikachu.png',
    saludMaxima: 50,
    ataque: 80,
    defensa: 30
  };

  beforeEach(async () => {
    // Creamos un Subject controlable desde el test
    pokemonsSubject = new BehaviorSubject<Pokemon[]>([]);

    pokemonServiceMock = {
  getPokemons: () => pokemonsSubject.asObservable(),
  addPokemon: jasmine.createSpy('addPokemon').and.returnValue(of(null)),
  deletePokemon: jasmine.createSpy('deletePokemon').and.returnValue(of(null)),
};

    await TestBed.configureTestingModule({
      imports: [PokedexPage],
      providers: [
        provideRouter([]),
        // Inyectamos nuestro mock en lugar del servicio real
        { provide: PokemonService, useValue: pokemonServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokedexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ============================================================
  //   TEST 1 — Creación
  // ============================================================
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  //   TEST 2 — El componente reacciona al servicio (integración)
  // ============================================================
  it('debe mostrar los Pokémon que emite el servicio', () => {
    // Emitimos un nuevo valor desde el mock
    pokemonsSubject.next([pikachuMock]);
    fixture.detectChanges();

    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].nombre).toBe('Pikachu');
  });

  it('debe mostrar mensaje "Pokedex vacía" cuando no hay pokémon', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('vacía');
  });

  // ============================================================
  //   TEST 3 — Abrir y cerrar modal
  // ============================================================
  it('abrirModal() debe cambiar mostrarModal a true', () => {
    expect(component.mostrarModal).toBe(false);
    component.abrirModal();
    expect(component.mostrarModal).toBe(true);
  });

  it('cerrarModal() debe cambiar mostrarModal a false', () => {
    component.mostrarModal = true;
    component.cerrarModal();
    expect(component.mostrarModal).toBe(false);
  });

  // ============================================================
  //   TEST 4 — onEliminar() llama al servicio con el id correcto
  // ============================================================
  it('onEliminar(id) debe llamar a deletePokemon del servicio', () => {
    component.onEliminar(5);
    expect(pokemonServiceMock.deletePokemon).toHaveBeenCalledWith(5);
  });
});