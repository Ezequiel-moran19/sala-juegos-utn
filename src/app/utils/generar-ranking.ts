export function generarRanking( data: { usuario: string; puntaje: number;}[] ) {

  const acumulador: {[usuario: string]: number} = {};

  data.forEach((p) => {
    if (acumulador[p.usuario]) {
      acumulador[p.usuario] += p.puntaje;
    } else {
      acumulador[p.usuario] = p.puntaje;
    }
  });

  const ranking = [];

  for (const usuario in acumulador) {
    ranking.push({ usuario, puntaje: acumulador[usuario] });
  }

  ranking.sort((a, b) => b.puntaje - a.puntaje);

  return ranking.slice(0, 5);
}