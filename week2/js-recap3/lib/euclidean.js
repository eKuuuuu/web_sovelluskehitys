/**
 *
 * @param alkupiste  geoJSON-objekti, joka sisältää kaksi koordinaattia
 * @param loppupiste geoJSON-objekti, joka sisältää kaksi koordinaattia
 * @returns etäisyys alkupisteen ja loppupisteen välillä
 */
export function distance(alkupiste, loppupiste) {
    return Math.sqrt((loppupiste[0] - alkupiste[0]) ** 2 + (loppupiste[1] - alkupiste[1]) ** 2);
}