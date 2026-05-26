export interface PartidaSudoku {
  usuario: string;
  puntaje: number;
  movimientos: number;
  tiempo: number;
  gano: boolean;
  fecha: string;
}

// create table partidas_sudoku (

//   id bigint generated always as identity primary key,
//   usuario text,
//   puntaje int,
//   movimientos int,
//   tiempo int,
//   gano boolean,
//   fecha timestamp
// );