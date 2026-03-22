const { program } = require('commander');
const fs = require('fs');

// Налаштовуємо спільні параметри командного рядка
program
  .option('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);
const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

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