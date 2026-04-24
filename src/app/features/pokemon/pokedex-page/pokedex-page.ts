import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../core/pokemon.service';
import { Pokemon } from '../../../core/pokemon.model';
import { PokemonItems } from '../pokemon-items/pokemon-items';
import { NuevoPokemon } from '../nuevo-pokemon/nuevo-pokemon';

/**
 * PokedexPageComponent — componente principal de la Mini Pokedex.
 *
 * Según el enunciado:
 *  - Se suscribe al PokemonService para mostrar la lista actualizada.
 *  - Incluye un botón "Añadir Pokémon" que abre un modal.
 *  - El modal es una ventana centrada implementada manualmente.
 *
 * Funciona como "padre":
 *  - Le pasa cada Pokémon a un PokemonItems hijo (@Input).
 *  - Escucha el @Output (eliminar) para borrar el Pokémon del servicio.
 *  - Escucha el @Output (cerrar) de NuevoPokemon para cerrar el modal.
 */
@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  imports: [CommonModule, PokemonItems, NuevoPokemon],
  templateUrl: './pokedex-page.html',
  styleUrl: './pokedex-page.css'
})
export class PokedexPage implements OnInit {

  /** Lista de Pokémon que se mostrará en la vista.
   *  Se actualiza sola gracias a la suscripción al BehaviorSubject. */
  pokemons: Pokemon[] = [];

  /** Flag que controla si el modal está abierto o cerrado. */
  mostrarModal = false;

  /** Inyección del servicio global en el constructor */
  constructor(private pokemonService: PokemonService) {}

  /**
   * ngOnInit se ejecuta cuando el componente se inicializa.
   * Aquí nos suscribimos al observable del servicio: cada vez que
   * el servicio llame a .next() con una lista nueva, este callback
   * se ejecuta y actualiza this.pokemons → Angular refresca la vista.
   */
  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(lista => {
      this.pokemons = lista;
    });
  }

  /** Abre el modal */
  abrirModal(): void {
    this.mostrarModal = true;
  }

  /** Cierra el modal */
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  /**
   * Handler para cuando una tarjeta emite el evento (eliminar).
   * Recibe el id del Pokémon a eliminar (desde @Output() eliminar).
   */
onEliminar(id: number): void {
  this.pokemonService.deletePokemon(id).subscribe();
}
}