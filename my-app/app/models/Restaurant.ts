import mongoose, { Schema, model, models } from 'mongoose';

// Definindo o schema do MenuItem
const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

// Schema para o endereço
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
});

// Atualizando o schema do restaurante
const RestaurantSchema = new Schema({
  banner: { type: String, required: true },
  logo: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  time: { type: String, required: true },
  price: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true }, // Usando o schema de endereço
  menu: {
    destaque: [MenuItemSchema],
    pratos: [MenuItemSchema],
    bebidas: [MenuItemSchema],
  },
});

// Verifica se o modelo já foi definido, se não, cria o modelo
const Restaurant = models.Restaurant || model('Restaurant', RestaurantSchema);

export default Restaurant;
