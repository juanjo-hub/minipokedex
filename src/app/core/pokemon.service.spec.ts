import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://127.0.0.1:8000/api/pokemons';

  const pikachuMock: Pokemon = {
    id: 1,
    nombre: 'Pikachu',
    tipo: 'Eléctrico',
    imagen: 'pikachu.png',
    saludMaxima: 50,
    ataque: 80,
    defensa: 30
  };

  const charmanderMock: Pokemon = {
    id: 2,
    nombre: 'Charmander',
    tipo: 'Fuego',
    imagen: 'charmander.png',
    saludMaxima: 60,
    ataque: 75,
    defensa: 35
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que NO hay peticiones HTTP pendientes sin simular
    httpMock.verify();
  });

  // ============================================================
  //   TEST 1 — Creación del servicio (0,75 pts)
  // ============================================================
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ============================================================
  //   TEST 2 — Listar Pokémon (0,75 pts)
  // ============================================================
  it('debe devolver un observable con lista vacía al inicio', async () => {
    const lista = await firstValueFrom(service.getPokemons());
    expect(lista).toEqual([]);
  });

  // ============================================================
  //   TEST 3 — Añadir Pokémon y hacer POST al backend
  // ============================================================
  it('addPokemon() debe añadir a la lista local', async () => {
    service.addPokemon(pikachuMock).subscribe();

    // Simular que el backend responde OK
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(pikachuMock);
    req.flush(pikachuMock);

    const lista = await firstValueFrom(service.getPokemons());
    expect(lista.length).toBe(1);
    expect(lista[0]).toEqual(pikachuMock);
  });

  // ============================================================
  //   TEST 4 — Eliminar Pokémon (0,75 pts)
  // ============================================================
  it('deletePokemon() debe eliminar de la lista local y hacer DELETE', async () => {
    // Añadimos 2 pokémon (simulando las respuestas del POST)
    service.addPokemon(pikachuMock).subscribe();
    httpMock.expectOne(apiUrl).flush(pikachuMock);

    service.addPokemon(charmanderMock).subscribe();
    httpMock.expectOne(apiUrl).flush(charmanderMock);

    // Eliminamos el primero (id: 1)
    service.deletePokemon(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const lista = await firstValueFrom(service.getPokemons());
    expect(lista.length).toBe(1);
    expect(lista[0].nombre).toBe('Charmander');
  });

  // ============================================================
  //   TEST 5 — cargarDesdeApi() hace GET y actualiza la lista
  // ============================================================
  it('cargarDesdeApi() debe hacer GET y rellenar la lista', async () => {
    service.cargarDesdeApi().subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([pikachuMock, charmanderMock]);

    const lista = await firstValueFrom(service.getPokemons());
    expect(lista.length).toBe(2);
    expect(lista[0].nombre).toBe('Pikachu');
  });

  // ============================================================
  //   TEST 6 — Datos incorrectos / vacíos (0,75 pts)
  // ============================================================
  it('deletePokemon() con un id inexistente no debe modificar la lista', async () => {
    service.addPokemon(pikachuMock).subscribe();
    httpMock.expectOne(apiUrl).flush(pikachuMock);

    service.deletePokemon(9999).subscribe();
    httpMock.expectOne(`${apiUrl}/9999`).flush(null);

    const lista = await firstValueFrom(service.getPokemons());
    expect(lista.length).toBe(1);
    expect(lista[0].nombre).toBe('Pikachu');
  });

  it('cargarDesdeApi() con respuesta vacía deja la lista vacía', async () => {
    service.cargarDesdeApi().subscribe();
    httpMock.expectOne(apiUrl).flush([]);

    const lista = await firstValueFrom(service.getPokemons());
    expect(lista).toEqual([]);
  });
});