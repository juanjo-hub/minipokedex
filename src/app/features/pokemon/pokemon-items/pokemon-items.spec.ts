import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PokemonItems } from './pokemon-items';
import { Pokemon } from '../../../core/pokemon.model';

describe('PokemonItems', () => {
  let component: PokemonItems;
  let fixture: ComponentFixture<PokemonItems>;

  const pokemonMock: Pokemon = {
    id: 1,
    nombre: 'Pikachu',
    tipo: 'Eléctrico',
    imagen: 'https://example.com/pikachu.png',
    saludMaxima: 50,
    ataque: 80,
    defensa: 30
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonItems]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonItems);
    component = fixture.componentInstance;

    component.pokemon = pokemonMock;
    fixture.detectChanges();
  });

  // ============================================================
  //   TEST 1 — Creación del componente
  // ============================================================
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  //   TEST 2 — El HTML muestra los datos del Pokémon
  // ============================================================
  it('debe mostrar el nombre del Pokémon en el HTML', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.textContent).toContain('Pikachu');
  });

  it('debe mostrar el tipo del Pokémon', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.textContent).toContain('Eléctrico');
  });

  it('debe mostrar las stats (salud, ataque, defensa)', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('50');  // salud
    expect(texto).toContain('80');  // ataque
    expect(texto).toContain('30');  // defensa
  });

  // ============================================================
  //   TEST 3 — El botón eliminar emite el evento con el id
  // ============================================================
  it('al pulsar "Eliminar" debe emitir el evento con el id', () => {
let idEmitido: number | undefined;
component.eliminar.subscribe((id: number) => {
  idEmitido = id;
});

    // Buscamos el botón y simulamos el clic
    const boton = fixture.debugElement.query(By.css('.btn-eliminar'));
    boton.nativeElement.click();

    expect(idEmitido).toBe(1);
  });

  // ============================================================
  //   TEST 4 — Método colorTipo() devuelve color correcto
  // ============================================================
  it('colorTipo() debe devolver el color correcto según el tipo', () => {
    expect(component.colorTipo()).toBe('#f8b500'); // Eléctrico → amarillo

    component.pokemon = { ...pokemonMock, tipo: 'Fuego' };
    expect(component.colorTipo()).toBe('#e52521'); // Fuego → rojo

    component.pokemon = { ...pokemonMock, tipo: 'Agua' };
    expect(component.colorTipo()).toBe('#1976d2'); // Agua → azul
  });

  it('colorTipo() debe devolver color por defecto para tipos desconocidos', () => {
    component.pokemon = { ...pokemonMock, tipo: 'Dragón' };
    expect(component.colorTipo()).toBe('#757575'); // color por defecto
  });
});