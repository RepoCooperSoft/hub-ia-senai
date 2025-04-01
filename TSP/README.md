# 🐜 ACO para o Problema do Caixeiro Viajante (TSP)

Implementação do algoritmo Ant Colony Optimization (ACO) em Node.js para resolver o Problema do Caixeiro Viajante (TSP).

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- Arquivos TSP no formato [TSPLIB](http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/tsp/) (ex: `att48.tsp`, `berlin52.tsp`)

## 🚀 Como Executar

1. Instale o Node.js: [https://nodejs.org/](https://nodejs.org/)
2. Coloque seu arquivo `.tsp` na mesma pasta do script
3. Execute no terminal:

```bash
node tsp-aco.js arquivo.tsp
```

Ou para arquivos compactados:
```bash
node tsp-aco.js arquivo.tsp.gz
```

## ⚙️ Configurações do ACO

Os parâmetros podem ser ajustados no código:

```javascript
const ACO_CONFIG = {
    ANTS: 60,             // Número de formigas (soluções por iteração)
    ITERATIONS: 100,      // Número de iterações
    ALPHA: 1.0,           // Peso do feromônio
    BETA: 3.0,            // Peso da heurística (1/distância)
    EVAPORATION: 0.5,     // Taxa de evaporação do feromônio
    PHEROMONE_DEPOSIT: 100 // Quantidade de feromônio depositado
};
```

## 📊 Saída

O programa gera um arquivo `.opt.tour` com:
- Nome do problema
- Comprimento da melhor rota encontrada
- Tipo e dimensão
- Lista de cidades na ordem da rota

## 🔍 Funcionamento

1. **Leitura do arquivo**: Extrai as coordenadas das cidades
2. **Matriz de distâncias**: Calcula distâncias entre todas as cidades
3. **ACO**:
   - Formigas constroem rotas probabilísticas
   - Feromônios são depositados nas melhores rotas
   - Feromônios evaporam a cada iteração
4. **Resultado**: Salva a melhor rota encontrada

## ⚡ Dicas

- Para problemas grandes (>500 cidades), aumente `ITERATIONS` e `ANTS`
- Ajuste `ALPHA` e `BETA` para balancear entre exploração e exploração
- Arquivos de teste podem ser baixados em: [TSPLIB](http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/tsp/)

## 📄 Licença

Este projeto está licenciado sob a licença MIT.