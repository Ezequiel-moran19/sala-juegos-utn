export interface PartidaMayorMenor {
  id?: number;
  usuario: string;
  cartas_acertadas: number;
  puntaje: number;
  fecha: string;
}

// create table partidas_mayor_menor (
//   id bigint generated always as identity primary key,
//   usuario text not null,
//   cartas_acertadas int not null,
//   puntaje int not null,
//   fecha timestamptz not null
// );