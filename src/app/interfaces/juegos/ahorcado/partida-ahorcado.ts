export interface PartidaAhorcado {
  id?: number;
  usuario: string;
  palabra: string;
  gano: boolean;
  errores: number;
  letras_seleccionadas: number;
  tiempo: number;
  puntaje: number;
  fecha: string;
}


// CREATE TABLE partidas_ahorcado (
//   id bigint generated always as identity primary key,
//   usuario text,
//   palabra text,
//   gano boolean,
//   errores int,
//   letras_seleccionadas int,
//   tiempo int,
//   puntaje int,
//   fecha timestamp default now()
// );