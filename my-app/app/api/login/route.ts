import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Para comparar senhas criptografadas
import Cliente from "../../models/Cliente"; // Modelo do cliente (ajuste o caminho conforme necessário)
import {connectToDatabase} from "../../lib/db"; // Função para conectar ao MongoDB

export async function POST(req: Request) {
  try {
    await connectToDatabase(); // Certifique-se de conectar ao banco
    
    const { email, password } = await req.json();

    // Verifica se o e-mail existe no banco
    const user = await Cliente.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "E-mail não encontrado" }, { status: 404 });
    }

    // Compara a senha fornecida com a armazenada
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ success: false, message: "Senha incorreta" }, { status: 401 });
    }
    // Retorna sucesso
    return NextResponse.json({ 
      success: true, 
      message: "Login bem-sucedido", 
      user: {
        nome: user.nome,
        email: user.email,
        endereco: user.endereco
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 });
  }
}
