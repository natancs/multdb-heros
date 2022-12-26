// databases
show dbs

// mudando o contexto para uma database
use heros

// mostrar tables (coleções)
show collections

for (let i = 0; i <= 1000; i++) {
  db.heros.insert({
    nome: `Clone-${i}`,
    poder: `Velocidade`,
    dataNascimento: `1998-01-01`
  })
}

// create
db.heros.insert({
  nome: "Flash",
  poder: "Velocidade",
  dataNascimento: "1998-01-01"
})

//read
db.heros.findOne()
db.heros.count()
db.heros.find().limit(500).sort({ nome: -1 })
db.heros.find({}, { poder: 1, _id: 0 })
db.heros.find()
db.heros.find().pretty()


//update
db.heros.updateOne({ _id: ObjectId("6391e337799f5e91364430a2") }, { $set: { nome: "Mulher Maravilha" } })

//delete
db.heros.remove({})