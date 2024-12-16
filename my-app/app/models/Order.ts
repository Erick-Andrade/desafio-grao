import mongoose, { Schema, Document } from "mongoose";

interface IItem {
  name: string;
  quantity: number;
  price: number; 
}

interface IOrder extends Document {
  orderId: string;
  email: string;
  restaurant: string;  // Apenas o nome do restaurante
  price: number; // Preço total do pedido
  items: IItem[];  // Itens do pedido
}

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  restaurant: { type: String, required: true }, // Agora é só o nome
  price: { type: Number, required: true },  // Campo para o preço total
  items: { type: [itemSchema], required: true },
});

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
