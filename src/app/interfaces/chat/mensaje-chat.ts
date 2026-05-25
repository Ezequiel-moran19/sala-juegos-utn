export interface MensajeChat {
  id?: number;
  usuario: string;
  mensaje: string; 
  fecha: string;
}

// Tabla para guardar los mensajes del chat en la base de datos.
// CREATE TABLE mensajes_chat (
//   id bigint generated always as identity primary key,
//   usuario text,
//   mensaje text,
//   fecha timestamp default now()
// );