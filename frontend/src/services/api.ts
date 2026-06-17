const API_BASE = "/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = "Erro na requisição";
    try {
      if (isJson) {
        const jsonError = await response.json();
        errorMessage = jsonError.message || JSON.stringify(jsonError);
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = "Erro desconhecido";
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  if (isJson) {
    return response.json();
  }

  return response.text();
}

export async function buscarObras(termo?: string, ano?: number, categoria?: string, emAlta?: boolean) {
  const params = new URLSearchParams();
  if (termo) params.append("termo", termo);
  if (ano) params.append("ano", ano.toString());
  if (categoria) params.append("categoria", categoria);
  if (emAlta) params.append("emAlta", "true");
  const res = await fetch(`${API_BASE}/acervo/buscar?${params.toString()}`);
  return handleResponse(res);
}

export async function obterObra(id: number) {
  const res = await fetch(`${API_BASE}/acervo/obras/${id}`);
  return handleResponse(res);
}

export async function cadastrarObra(dados: any) {
  const res = await fetch(`${API_BASE}/acervo/obras`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function editarObra(id: number, dados: any) {
  const res = await fetch(`${API_BASE}/acervo/obras/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function removerObra(id: number) {
  const res = await fetch(`${API_BASE}/acervo/obras/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function listarExemplares(idObra?: number) {
  const url = idObra ? `${API_BASE}/acervo/exemplares?idObra=${idObra}` : `${API_BASE}/acervo/exemplares`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function cadastrarExemplar(dados: any) {
  const res = await fetch(`${API_BASE}/acervo/exemplares`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function editarExemplar(id: number, dados: any) {
  const res = await fetch(`${API_BASE}/acervo/exemplares/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function removerExemplar(id: number) {
  const res = await fetch(`${API_BASE}/acervo/exemplares/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function associarLocalizacao(idExemplar: number, idLocalizacao: number) {
  const res = await fetch(`${API_BASE}/acervo/exemplares/${idExemplar}/localizacao/${idLocalizacao}`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function listarLocalizacoes() {
  const res = await fetch(`${API_BASE}/acervo/localizacoes`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function cadastrarLocalizacao(dados: any) {
  const res = await fetch(`${API_BASE}/acervo/localizacoes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function editarLocalizacao(id: number, dados: any) {
  const res = await fetch(`${API_BASE}/acervo/localizacoes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function consultarDisponibilidade(idObra: number) {
  const res = await fetch(`${API_BASE}/acervo/obras/${idObra}/disponibilidade`);
  return handleResponse(res);
}

export async function login(email: string, senha: string) {
  const res = await fetch(`${API_BASE}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return handleResponse(res);
}

export async function autoCadastro(dados: any) {
  const res = await fetch(`${API_BASE}/usuarios/auto-cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function cadastrarLeitor(dados: any) {
  const res = await fetch(`${API_BASE}/usuarios/cadastrar`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function listarLeitores() {
  const res = await fetch(`${API_BASE}/usuarios/leitores`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function editarLeitor(id: number, dados: any) {
  const res = await fetch(`${API_BASE}/usuarios/editar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

export async function bloquearLeitor(id: number) {
  const res = await fetch(`${API_BASE}/usuarios/bloquear/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function desbloquearLeitor(id: number) {
  const res = await fetch(`${API_BASE}/usuarios/desbloquear/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function aprovarLeitor(id: number) {
  const res = await fetch(`${API_BASE}/usuarios/aprovar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function realizarEmprestimo(idLeitor: number, idExemplar: number) {
  const res = await fetch(`${API_BASE}/emprestimos/realizar?idLeitor=${idLeitor}&idExemplar=${idExemplar}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function registrarDevolucao(idExemplar: number) {
  const res = await fetch(`${API_BASE}/emprestimos/devolucao/${idExemplar}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function renovarEmprestimo(idEmprestimo: number) {
  const res = await fetch(`${API_BASE}/emprestimos/renovar/${idEmprestimo}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function solicitarRenovacao(idEmprestimo: number, idLeitor: number) {
  const res = await fetch(`${API_BASE}/emprestimos/solicitar-renovacao`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ idEmprestimo, idLeitor }),
  });
  return handleResponse(res);
}

export async function registrarReservaBibliotecario(idLeitor: number, idObra: number) {
  const res = await fetch(`${API_BASE}/emprestimos/reservar?idLeitor=${idLeitor}&idObra=${idObra}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function solicitarReservaLeitor(idObra: number) {
  const res = await fetch(`${API_BASE}/emprestimos/solicitar-reserva?idObra=${idObra}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function meusEmprestimos(idLeitor: number) {
  const res = await fetch(`${API_BASE}/emprestimos/meus-emprestimos/${idLeitor}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function historicoLeitor(idLeitor: number) {
  const res = await fetch(`${API_BASE}/emprestimos/historico-leitura/${idLeitor}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function listarEmprestimosAtivos() {
  const res = await fetch(`${API_BASE}/emprestimos/ativos`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function obterAvaliacoes(idObra: number) {
  const res = await fetch(`${API_BASE}/avaliacoes/obra/${idObra}`);
  return handleResponse(res);
}

export async function avaliarLivro(idObra: number, nota: number, comentario: string) {
  const res = await fetch(`${API_BASE}/avaliacoes/obra/${idObra}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ nota, comentario }),
  });
  return handleResponse(res);
}

export async function listarFavoritos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/favoritos`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function adicionarFavorito(idObra: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favoritos/${idObra}`, {
    method: "POST",
    headers: getHeaders(),
  });
  await handleResponse(res);
}

export async function removerFavorito(idObra: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favoritos/${idObra}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  await handleResponse(res);
}

export async function verificarFavorito(idObra: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/favoritos/check/${idObra}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function buscarRecomendados(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/acervo/recomendados`);
  return handleResponse(res);
}

export async function listarCategorias(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/categorias`);
  return handleResponse(res);
}