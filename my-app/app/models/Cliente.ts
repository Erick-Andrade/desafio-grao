import mongoose, { Schema, model, models } from "mongoose";

const EnderecoSchema = new Schema({
  cep: { type: String, required: true },
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  pontoReferencia: { type: String },
});

const ClienteSchema = new Schema({
  nome: { type: String, required: true },
  endereco: { type: EnderecoSchema, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Cliente = models.Cliente || model("Cliente", ClienteSchema);

export default Cliente;
