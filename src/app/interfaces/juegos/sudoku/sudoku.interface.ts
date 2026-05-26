export interface Celda {
  valor: number | null;
  fijo: boolean;
  error?: boolean;
  completado?: boolean; 
}

export type Tablero = Celda[][];