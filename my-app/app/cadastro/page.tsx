"use client";
import { useState } from "react";
import styles from "../styles/CadastroCliente.module.css";
import { useRouter } from 'next/navigation';


const fieldsStep1 = [
  { label: "Nome", type: "text", placeholder: "Nome", key: "nome", required: true },
  { label: "E-mail", type: "email", placeholder: "E-mail", key: "email", required: true },
  { label: "Senha", type: "password", placeholder: "Senha", key: "password", required: true },
];

const fieldsStep2 = [
  { label: "CEP", type: "text", placeholder: "XXXXX-XXX", key: "cep", required: true },
  { label: "Logradouro", type: "text", placeholder: "Logradouro", key: "logradouro", required: true },
];

const fieldsHalfStep2 = [
  [
    { label: "Número", type: "text", placeholder: "Número", key: "numero", required: true },
    { label: "Complemento", type: "text", placeholder: "Complemento", key: "complemento", required: false},
  ], 
  [
    { label: "Bairro", type: "text", placeholder: "Bairro", key: "bairro", required: true },
    { label: "Cidade", type: "text", placeholder: "Cidade", key: "cidade", required: true },
  ],
  [
    { label: "Estado", type: "text", placeholder: "Estado", key: "estado", required: true },
    { label: "Ponto de Referência", type: "text", placeholder: "Ponto de Referência", key: "pontoReferencia", required: false },
  ]
]

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidCep = (cep: string) => /^\d{5}-?\d{3}$/.test(cep);


const validateSimpleFields = (fields, values) => {
  for (const field of fields) {
    if (field.required && !values[field.key]) {
      alert(`Por favor, preencha o campo: ${field.label}`);
      return false;
    }
    
    if (field.key === "cep" && !isValidCep(values.cep)) {
      alert("Por favor, insira um válido XXXXX-XXX");
      return false;
    }
    if (field.key === "email" && !isValidEmail(values.email)) {
      alert("Por favor, insira um e-mail válido.");
      return false;
    }
  }
  return true;
};

const validateHalfFields = (fieldsGroups, values) => {
  for (const group of fieldsGroups) {
    for (const field of group) {
      if (field.required && !values[field.key]) {
        alert(`Por favor, preencha o campo: ${field.label}`);
        return false;
      }
    }
  }
  return true;
};


export default function CadastroCliente() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    password: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pontoReferencia: "",
  });
  const router = useRouter();

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleStep1Submit = async () => {
    const { nome, email, password, ...endereco } = formValues;
    const response = await fetch("../api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, step:1}),
    });

    const data = await response.json();
    if (validateSimpleFields(fieldsStep1, formValues) && data.message === "E-mail disponível!") {
      // Se o e-mail estiver disponível, continue para a segunda etapa
      setCurrentStep(2);
    } else {
      alert(data.message); // Exibe erro caso o e-mail já exista
    }
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    const step2Valid = validateSimpleFields(fieldsStep2, formValues) && validateHalfFields(fieldsHalfStep2, formValues);

    if (step2Valid) {
      const { nome, email, password, ...endereco } = formValues;
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password, endereco, step:2 }),
      });

    const data = await response.json();
    if (data.message === "Cliente cadastrado com sucesso!") {
      alert(data.message);
      router.push('/');
    } else {
      alert(data.message); // Exibe erro caso haja algum problema
      }
    };
  }

  const renderSimpleFields = (fields) =>
    fields.map((field) => (
      <div key={field.key} className={styles.inputGroup}>
        <label className={styles.label}>
          {field.label} {field.required && <span className={styles.required}>*</span>}
        </label>
        <input
          className={styles.input}
          type={field.type}
          placeholder={field.placeholder}
          value={formValues[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
        />
      </div>
    ));

    const renderHalfFields = (fieldsGroup) => (
      fieldsGroup.map((fields, index) => (
        <div key={index} className={styles.doubleInputGroup}>
          {fields.map((field) => (
            <div key={field.key} className={styles.inputHalf}>
              <label className={styles.label}>
                {field.label} {field.required && <span className={styles.required}>*</span>}
              </label>
              <input
                className={`${styles.input} ${styles.inputHalf}`}
                type={field.type}
                placeholder={field.placeholder}
                value={formValues[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))
    );
    
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Cadastro de Cliente</h1>

        {currentStep === 1 && (
          <div className={styles.step}>
            {renderSimpleFields(fieldsStep1)}
            <div className={styles.buttonGroup}>
            <button
                className={styles.button}
                type="button"
                onClick={handleBack}
              >
                Voltar
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={handleStep1Submit}
              >
                Próxima Etapa
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit}>
            <div className={styles.step}>
              {renderSimpleFields(fieldsStep2)}
              {renderHalfFields(fieldsHalfStep2)}

              <div className={styles.buttonGroup}>
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => setCurrentStep(1)}
                >
                  Voltar
                </button>
                <button className={styles.button} type="submit">
                  Cadastrar
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
