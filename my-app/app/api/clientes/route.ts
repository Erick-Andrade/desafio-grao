import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../../lib/db";
import Cliente from "../../models/Cliente";

// Método POST para verificar se o e-mail já está cadastrado (para a primeira etapa) ou para fazer o cadastro completo (segunda etapa)
export async function POST(req: NextRequest) {
  // Lê o corpo da requisição uma vez
  const requestData = await req.json();
  const { email, step, nome, endereco, password } = requestData;

  // Verifica se o campo e-mail foi enviado
  if (!email) {
    return NextResponse.json(
      { message: "E-mail é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Conecta ao banco de dados
    await connectToDatabase();

    // Se for a primeira etapa (apenas verificando e-mail)
    if (step === 1) {
      // Verifica se já existe um cliente com o mesmo e-mail
      const clienteExistente = await Cliente.findOne({ email });
      if (clienteExistente) {
        return NextResponse.json(
          { message: "Este e-mail já está cadastrado" },
          { status: 400 }
        );
      }

      // Se o e-mail não existir, responde que o e-mail está disponível
      return NextResponse.json(
        { message: "E-mail disponível!" },
        { status: 200 }
      );
    }

    // Se for a segunda etapa (fazendo o cadastro completo)
    if (step === 2) {
      // Verifica se os campos necessários foram enviados
      if (!nome || !endereco || !password) {
        return NextResponse.json(
          { message: "Todos os campos são obrigatórios" },
          { status: 400 }
        );
      }

      // Hash da senha utilizando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criação de um novo cliente com a senha criptografada
      const cliente = new Cliente({
        nome,
        endereco,
        email,
        password: hashedPassword, // Armazena o hash da senha
      });

      // Salva o cliente no banco de dados
      await cliente.save();

      // Retorna uma resposta de sucesso
      return NextResponse.json({ message: "Cliente cadastrado com sucesso!" }, { status: 201 });
    }

    // Caso o `step` seja inválido, retorna erro
    return NextResponse.json(
      { message: "Etapa inválida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return NextResponse.json(
      { message: "Erro ao cadastrar cliente", error: error.message },
      { status: 500 }
    );
  }
}
