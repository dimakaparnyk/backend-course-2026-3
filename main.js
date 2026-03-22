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