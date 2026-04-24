import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../../core/pokemon.model';

/**
 * PokemonItemComponent — tarjeta de un único Pokémon.
 *
 * Según el enunciado:
 *  - Recibe los datos del Pokémon mediante @Input()
 *  - Emite un @Output() cuando se pulsa el botón "Eliminar"
 *  - Diseñada con nuestro propio CSS
 */
@Component({
  selector: 'app-pokemon-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-items.html',
  styleUrl: './pokemon-items.css'
})
export class PokemonItems {

  /** Entrada: el Pokémon que hay que pintar en la tarjeta.
   *  El "!" le dice a TypeScript: "confía, el padre SIEMPRE me lo pasa". */
  @Input() pokemon!: Pokemon;

  /** Salida: evento que se emite al pulsar Eliminar.
   *  Envía el id del Pokémon al componente padre. */
  @Output() eliminar = new EventEmitter<number>();

  /** Método invocado al pulsar el botón de la tarjeta. */
  onEliminarClick(): void {
    this.eliminar.emit(this.pokemon.id);
  }

  /**
   * Devuelve un color de fondo según el tipo del Pokémon.
   * Se llama desde el HTML mediante [style.background]="colorTipo()"
   */
  colorTipo(): string {
    const tipo = (this.pokemon.tipo || '').toLowerCase();
    switch (tipo) {
      case 'fuego':     return '#e52521';
      case 'agua':      return '#1976d2';
      case 'planta':    return '#43b047';
      case 'eléctrico':
      case 'electrico': return '#f8b500';
      case 'hada':      return '#f48fb1';
      case 'hielo':     return '#4fc3f7';
      case 'lucha':     return '#bf360c';
      case 'psíquico':
      case 'psiquico':  return '#ab47bc';
      default:          return '#757575';
    }
  }
}