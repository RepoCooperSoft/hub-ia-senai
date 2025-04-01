const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CONFIGURAÇÕES
const ACO_CONFIG = {
    ANTS: 60, // Número de formigas
    ITERATIONS: 100, // Número de iterações
    ALPHA: 1.0, // Importância do feromônio
    BETA: 3.0, // Importância da heurística
    EVAPORATION: 0.5, // Taxa de evaporação do feromônio
    PHEROMONE_DEPOSIT: 100 // Quantidade de feromônio depositado por uma formiga
};

// 1. Ler arquivo TSP
function readTSPFile(filePath) {
    let content;

    try {
        if (filePath.endsWith('.gz')) {
            content = zlib.gunzipSync(fs.readFileSync(filePath)).toString();
        } else {
            content = fs.readFileSync(filePath, 'utf8');
        }

        const lines = content.split('\n');
        const coordStart = lines.findIndex(l => l.includes('NODE_COORD_SECTION'));
        const coordEnd = lines.findIndex(l => l.includes('EOF'));

        return lines.slice(coordStart + 1, coordEnd)
            .filter(l => l.trim() && !l.startsWith('-1'))
            .map(l => {
                const parts = l.trim().split(/\s+/);
                return { id: +parts[0], x: +parts[1], y: +parts[2] };
            });
    } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        return [];
    }
}

// 2. Calcular matriz de distâncias
function createDistanceMatrix(cities, distanceType) {
    const size = cities.length;
    const matrix = new Array(size).fill().map(() => new Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            const dist = calculateDistance(cities[i], cities[j], distanceType);
            matrix[i][j] = dist;
            matrix[j][i] = dist;
        }
    }
    return matrix;
}

function calculateDistance(a, b, type) {
    const dx = a.x - b.x, dy = a.y - b.y;

    switch (type) {
        case 'ATT':
            const rij = Math.sqrt((dx * dx + dy * dy) / 10.0);
            return Math.ceil(rij);
        case 'GEO':
            // Implementação simplificada para GEO
            const PI = 3.141592;
            const lat1 = PI * (a.x / 180), lon1 = PI * (a.y / 180);
            const lat2 = PI * (b.x / 180), lon2 = PI * (b.y / 180);
            const RRR = 6378.388;
            const q1 = Math.cos(lon1 - lon2);
            const q2 = Math.cos(lat1 - lat2);
            const q3 = Math.cos(lat1 + lat2);
            return Math.floor(RRR * Math.acos(0.5 * ((1 + q1) * q2 - (1 - q1) * q3)) + 1);
        default: // EUC_2D
            return Math.round(Math.sqrt(dx * dx + dy * dy));
    }
}

// 3. Algoritmo ACO
function runACO(cities, distances, distanceType) {
    const size = cities.length;
    let pheromones = new Array(size).fill().map(() => new Array(size).fill(1));
    let bestTour = [];
    let bestDistance = Infinity;

    for (let iter = 0; iter < ACO_CONFIG.ITERATIONS; iter++) {
        // Etapa 1: Construção de rotas pelas formigas
        const antTours = [];
        for (let ant = 0; ant < ACO_CONFIG.ANTS; ant++) {
            const tour = buildAntTour(distances, pheromones);
            const distance = calculateTourDistance(tour, distances);
            antTours.push({ tour, distance });

            if (distance < bestDistance) {
                bestTour = [...tour];
                bestDistance = distance;
                console.log(`Iter ${iter}: Distância = ${bestDistance}`);
            }
        }

        // Etapa 2: Atualização de feromônios
        pheromones = updatePheromones(pheromones, antTours, distances);
    }

    return { bestTour, bestDistance };
}

function buildAntTour(distances, pheromones) {
    const size = distances.length;
    const tour = [Math.floor(Math.random() * size)];
    const visited = new Set(tour);

    while (tour.length < size) {
        const current = tour[tour.length - 1];
        const next = selectNextCity(current, visited, distances, pheromones);
        tour.push(next);
        visited.add(next);
    }
    return tour;
}

function selectNextCity(current, visited, distances, pheromones) {
    const size = distances.length;
    let total = 0;
    const probabilities = [];

    for (let i = 0; i < size; i++) {
        if (!visited.has(i)) {
            const pheromone = Math.pow(pheromones[current][i], ACO_CONFIG.ALPHA);
            const heuristic = Math.pow(1 / distances[current][i], ACO_CONFIG.BETA);
            probabilities.push({ city: i, value: pheromone * heuristic });
            total += probabilities[probabilities.length - 1].value;
        }
    }

    const rand = Math.random() * total;
    let sum = 0;
    for (const { city, value } of probabilities) {
        sum += value;
        if (sum >= rand) return city;
    }
    return probabilities[0].city;
}

function calculateTourDistance(tour, distances) {
    let distance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
        distance += distances[tour[i]][tour[i + 1]];
    }
    // Fechar o ciclo (voltar ao início)
    return distance + distances[tour[tour.length - 1]][tour[0]];
}

function updatePheromones(pheromones, antTours, distances) {
    const size = pheromones.length;
    const newPheromones = pheromones.map(row => [...row]);

    // Evaporação
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            newPheromones[i][j] *= (1 - ACO_CONFIG.EVAPORATION);
        }
    }

    // Depósito de feromônio
    for (const { tour, distance } of antTours) {
        const deposit = ACO_CONFIG.PHEROMONE_DEPOSIT / distance;
        for (let i = 0; i < tour.length - 1; i++) {
            const from = tour[i], to = tour[i + 1];
            newPheromones[from][to] += deposit;
            newPheromones[to][from] += deposit;
        }
        // Fechar o ciclo
        const last = tour[tour.length - 1], first = tour[0];
        newPheromones[last][first] += deposit;
        newPheromones[first][last] += deposit;
    }

    return newPheromones;
}

// 4. Salvar arquivo .tour
function saveTourFile(tour, distance, filename) {
    const content = [
        `NAME: ${path.basename(filename)}.opt.tour`,
        `COMMENT: Length ${distance}`,
        `TYPE: TOUR`,
        `DIMENSION: ${tour.length}`,
        `TOUR_SECTION`,
        ...tour.map(city => city + 1), // TSPLIB usa base 1
        `-1\nEOF`
    ].join('\n');

    fs.writeFileSync(`${filename}.opt.tour`, content);
}

// EXECUÇÃO PRINCIPAL
function main() {
    const tspFile = process.argv[2] || 'att532.tsp'; // Arquivo padrão para teste
    console.log(`Processando: ${tspFile}`);

    // 1. Carregar cidades
    const cities = readTSPFile(tspFile);
    if (cities.length === 0) return;

    // 2. Criar matriz de distâncias (detecta tipo automaticamente)
    const distanceType = tspFile.includes('att') ? 'ATT' :
        tspFile.includes('geo') ? 'GEO' : 'EUC_2D';
    const distances = createDistanceMatrix(cities, distanceType);

    // 3. Executar ACO
    console.time('ACO');
    const { bestTour, bestDistance } = runACO(cities, distances, distanceType);
    console.timeEnd('ACO');

    // 4. Salvar resultados
    saveTourFile(bestTour, bestDistance, tspFile);
    console.log(`Melhor distância: ${bestDistance}`);
    console.log(`Solução salva em: ${tspFile}.opt.tour`);
}

main();