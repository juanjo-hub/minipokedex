import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Pokemon } from './pokemon.model';

/**
 * PokemonService — servicio global de la Mini Pokedex.
 *
 * Responsabilidades (según el enunciado):
 *  - Almacenar el estado de la lista de Pokémon mediante BehaviorSubject.
 *  - Listar, añadir y eliminar Pokémon.
 *
 * Además, se comunica con la API REST Laravel (opcional, para cumplir
 * las pruebas de integración con HttpClientTestingModule).
 * Si el backend no está disponible, el servicio sigue funcionando
 * con los datos en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  /** URL base de la API Laravel */
 private readonly apiUrl = 'https://minipokedex-laravel.onrender.com/api/pokemons';

  private http = inject(HttpClient);

  private pokemons: Pokemon[] = [];
  private pokemonsSubject = new BehaviorSubject<Pokemon[]>(this.pokemons);
  public pokemons$: Observable<Pokemon[]> = this.pokemonsSubject.asObservable();

  /** Listar: devuelve el observable con la lista actual. */
  getPokemons(): Observable<Pokemon[]> {
    return this.pokemons$;
  }

  /**
   * Añadir: añade a la lista local y hace POST al backend.
   * Devuelve un Observable para poder probarlo con HttpTestingController.
   */
  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    // Actualizamos estado local inmediatamente
    this.pokemons = [...this.pokemons, pokemon];
    this.pokemonsSubject.next(this.pokemons);

    // Lanzamos POST al backend
    return this.http.post<Pokemon>(this.apiUrl, pokemon);
  }

  /**
   * Eliminar: quita de la lista local y hace DELETE al backend.
   */
  deletePokemon(id: number): Observable<void> {
    this.pokemons = this.pokemons.filter(p => p.id !== id);
    this.pokemonsSubject.next(this.pokemons);

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cargar Pokémon desde el backend (GET /api/pokemons).
   * Actualiza el BehaviorSubject con el resultado.
   */
  cargarDesdeApi(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl).pipe(
      tap(lista => {
        this.pokemons = lista;
        this.pokemonsSubject.next(this.pokemons);
      })
    );
  }
}