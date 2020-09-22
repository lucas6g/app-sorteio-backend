const futuro = new Date(2020, 08, 23, 15, 30)

//futuro
const presente = new Date() //presente

if (futuro > presente) {
  console.log('esse sorteio ainda vai acontecer')
} else {
  console.log('esse sorteio ja aconteceu')
}

console.log(futuro)
console.log(presente)
