import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../../core/pokemon.service';
import { Pokemon } from '../../../core/pokemon.model';

/**
 * NuevoPokemonComponent — formulario de creación mostrado dentro del modal.
 *
 * Según el enunciado:
 *  - Formulario con nombre, tipo y URL de imagen (+ stats que añadimos)
 *  - Al enviar: llama al servicio para añadir el Pokémon y cierra el modal
 */
@Component({
  selector: 'app-nuevo-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-pokemon.html',
  styleUrl: './nuevo-pokemon.css'
})
export class NuevoPokemon {

  /** Evento que emitimos al padre para que cierre el modal */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Objeto del formulario. Lo vinculamos a los inputs del HTML
   * mediante [(ngModel)]="nuevo.nombre", etc.
   *
   * id se genera al guardar (Date.now() — número único basado en la fecha).
   */
  nuevo: Pokemon = this.formularioVacio();

  /** Mensaje de error que se muestra si el formulario no es válido */
  error: string | null = null;

  constructor(private pokemonService: PokemonService) {}

  /**
   * Envía el formulario.
   * 1. Valida los campos obligatorios.
   * 2. Genera un id único.
   * 3. Llama al servicio para añadir el Pokémon (hace POST al backend).
   * 4. Emite el evento cerrar para que el padre cierre el modal.
   */
  guardar(): void {
    if (!this.esValido()) {
      return;
    }

    // Generamos un id único basado en el timestamp actual
    this.nuevo.id = Date.now();

    // Si el usuario no puso imagen, usamos un placeholder con el nombre
    if (!this.nuevo.imagen.trim()) {
      this.nuevo.imagen =
        `https://placehold.co/200x200/cccccc/white?text=${encodeURIComponent(this.nuevo.nombre)}`;
    }

    // Hacemos copia del objeto (spread) y nos suscribimos al observable
    // para que la petición HTTP se ejecute de verdad.
    // Cerramos el modal tanto si el backend responde bien como si falla.
    this.pokemonService.addPokemon({ ...this.nuevo }).subscribe({
      next: () => this.cerrar.emit(),
      error: () => this.cerrar.emit()
    });
  }

  /** Cancela sin guardar */
  cancelar(): void {
    this.cerrar.emit();
  }

  /** Valida los campos mínimos y pone un mensaje de error si algo falla */
  private esValido(): boolean {
    if (!this.nuevo.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return false;
    }
    if (!this.nuevo.tipo) {
      this.error = 'Debes seleccionar un tipo.';
      return false;
    }
    if (this.nuevo.saludMaxima < 1 || this.nuevo.ataque < 0 || this.nuevo.defensa < 0) {
      this.error = 'Las stats deben ser válidas (salud ≥ 1, ataque/defensa ≥ 0).';
      return false;
    }
    this.error = null;
    return true;
  }

  /** Devuelve un objeto Pokemon vacío para inicializar el formulario */
  private formularioVacio(): Pokemon {
    return {
      id: 0,
      nombre: '',
      tipo: '',
      imagen: '',
      saludMaxima: 100,
      ataque: 50,
      defensa: 50
    };
  }
}