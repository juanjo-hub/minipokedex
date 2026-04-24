/**
 * Modelo que representa un Pokémon en la Mini Pokedex.
 *
 * Lo usamos como tipo en todos los componentes y en el servicio,
 * así evitamos errores tipo "escribí 'nombrePokemon' en vez de 'nombre'".
 */
export interface Pokemon {
  /** Identificador único. Lo generamos con Date.now() al crear el Pokémon.
   *  Hace falta para poder eliminar un Pokémon concreto. */
  id: number;

  /** Nombre del Pokémon (ej: Pikachu) */
  nombre: string;

  /** Tipo elemental (ej: "Eléctrico", "Fuego") */
  tipo: string;

  /** URL de la imagen del Pokémon */
  imagen: string;

  /** Puntos máximos de salud */
  saludMaxima: number;

  /** Puntos de ataque */
  ataque: number;

  /** Puntos de defensa */
  defensa: number;
}