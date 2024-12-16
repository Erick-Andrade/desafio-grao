import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import Order from '../../models/Order';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Extraímos o e-mail dos parâmetros de consulta da URL ou do cabeçalho
    const url = new URL(request.url);
    const email = url.searchParams.get('email'); // Assume que o e-mail é passado como parâmetro de consulta

    if (!email) {
      return NextResponse.json({ message: 'E-mail não fornecido' }, { status: 400 });
    }

    // Busca os pedidos no banco de dados pelo e-mail
    const orders = await Order.find({ email });

    if (orders.length === 0) {
      return NextResponse.json({ message: 'Nenhum pedido encontrado' });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro no handler GET:', error);
    return NextResponse.json({ message: 'Erro ao buscar os pedidos', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Extrair os dados do pedido
    const { orderId, email, restaurant, items, price } = await request.json();

    // Log para verificação
    console.log("Dados recebidos:", { orderId, email, restaurant, items, price });

    // Verificação simples dos dados
    if (!orderId || !email || !restaurant || !items || !price) {
      throw new Error("Dados incompletos");
    }

    const newOrder = new Order({
      orderId,
      email,
      restaurant,
      price,
      items,
    });

    await newOrder.save();

    return NextResponse.json({ message: 'Pedido confirmado', order: newOrder }, { status: 200 });
  } catch (error) {
    console.error('Erro no handler POST:', error);
    return NextResponse.json({ message: 'Erro ao salvar o pedido', error: error.message }, { status: 500 });
  }
}
