// app/api/restaurants/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/db"; // Função de conexão com o banco
import Restaurant from "../../models/Restaurant"; // Modelo do Restaurante

// Função para lidar com o GET request (obter restaurantes)
export async function GET(req: NextRequest) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();

    // Buscar os restaurantes no banco de dados
    const restaurants = await Restaurant.find();

    // Retornar a lista de restaurantes
    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar restaurantes:", error);
    return NextResponse.json({ error: "Erro ao buscar restaurantes!" }, { status: 500 });
  }
}