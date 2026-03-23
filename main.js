const { program } = require('commander');
const fs = require('fs');

program.configureOutput({
  writeErr: (str) => {
    if (str.includes("required option") || str.includes("argument missing")) {
      process.stderr.write("Please, specify input file\n");
    } else {
      process.stderr.write(str);
    }
  }
});

// Налаштовуємо спільні параметри командного рядка
program
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивести результат у консоль')
    .option('--date', 'відображати дату')
    .option('-a, --airtime <number>', 'фільтр за часом у повітрі');

program.parse(process.argv);
const options = program.opts();

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання файлу через readFileSync
const rawData = fs.readFileSync(options.input, 'utf-8');
let flights = [];

try {
  const lines = rawData.split('\n').filter(line => line.trim() !== '');
  flights = lines.map(line => JSON.parse(line));
} catch (error) {
  console.error("Помилка парсингу JSON:", error.message);
  process.exit(1);
}

// Фільтрація за часом у повітрі
let filteredFlights = flights;
if (options.airtime) {
  const minAirTime = parseInt(options.airtime, 10);
  filteredFlights = filteredFlights.filter(flight => parseInt(flight.AIR_TIME, 10) > minAirTime);
}

// Формування рядків з результатом
const resultLines = filteredFlights.map(flight => {
  return options.date 
    ? `${flight.FL_DATE} ${flight.AIR_TIME} ${flight.DISTANCE}` 
    : `${flight.AIR_TIME} ${flight.DISTANCE}`;
});

const resultString = resultLines.join('\n');

if (options.display) {
  console.log(resultString);
}

if (options.output) {
  fs.writeFileSync(options.output, resultString, 'utf-8');
}