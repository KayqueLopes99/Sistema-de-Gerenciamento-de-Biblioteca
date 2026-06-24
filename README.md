# Sistema de Gerenciamento de Biblioteca (SGB)

## Descrição e Objetivos
O Sistema de Gerenciamento de Biblioteca (SGB) é uma plataforma desenvolvida para otimizar a administração de acervos físicos e revolucionar a experiência de busca dos usuários. 

O grande diferencial tecnológico deste projeto é o seu **mapeamento interno de obras**. Diferente de sistemas tradicionais, o SGB cruza a disponibilidade do exemplar com a sua localização física exata (sala, estante e seção), oferecendo um **mapa interativo** que guia visualmente o leitor até o material desejado, reduzindo o tempo de busca e a dependência de atendimento no balcão.

---

##  Atores e Funcionalidades

O ecossistema é dividido em dois módulos principais para atender seus respectivos atores:

###  Módulo Administrativo (Ator: Bibliotecário)
Focado na eficiência operacional e controle do acervo.
* **Gestão de Obras e Exemplares:** Cadastro, edição e remoção de livros e suas cópias físicas individuais.
* **Mapeamento Físico:** Cadastro de novas áreas (salas, estantes e seções), associação de exemplares a localizações específicas e visualização do mapa da biblioteca.
* **Gestão de Leitores:** Cadastro, atualização e controle de bloqueios/inadimplências.
* **Ciclo de Empréstimos:** Registro de saídas, devoluções (com cálculo de multas), renovações e controle da fila de reservas.
* **Relatórios:** Consultas de disponibilidade e busca avançada no catálogo.

### Módulo Público (Ator: Leitor)
Focado na autonomia, interatividade e engajamento do usuário.
* **Acesso ao Acervo:** Auto-cadastro, login na plataforma, busca no catálogo, verificação de disponibilidade e visualização da localização do livro no mapa interativo.
* **Autogestão:** Solicitação de renovações, reservas de livros indisponíveis e consulta ao histórico de leituras.
* **Engajamento:** Sistema de avaliação de obras lidas (1 a 5 estrelas e comentários) e visualização das resenhas deixadas por outros usuários.

---

## Requisitos Não Funcionais
* **Segurança:** Proteção da privacidade dos dados via criptografia BCrypt para senhas e autenticação rigorosa.
* **Usabilidade:** Navegação intuitiva, suporte visual constante e design focado na facilidade de uso para ambos os atores.
* **Confiabilidade:** Alta tolerância a falhas e validação de dados, garantindo que o sistema não seja interrompido por entradas inválidas.
* **Desempenho:** Respostas a consultas críticas (como busca de obras e disponibilidade) processadas em menos de 2 segundos.

---

## Stack Técnica

O projeto utiliza uma arquitetura moderna dividida em camadas, operando como uma API RESTful.

| Camada | Tecnologia Utilizada | Justificativa |
| :--- | :--- | :--- |
| **Backend** | Java + Spring Boot | Produtividade, segurança integrada e separação clara de responsabilidades. |
| **Frontend** | React (com TypeScript/JS) | Criação de interfaces dinâmicas, responsivas e tipagem segura para manutenção. |
| **Banco de Dados** | PostgreSQL | Robustez relacional, integridade e suporte a transações ACID. |
| **Segurança / Auth** | JWT + BCrypt + Roles | Autenticação stateless, senhas protegidas e controle de acesso baseado em perfis (LEITOR/BIBLIOTECARIO). |
| **Defesa** | Validação de Entrada | Proteção ativa contra SQL Injection e XSS. |

---

## Diagrama de Classes de Projeto
> [Diagrama](./docs/Diagrama-Classe-Projeto.pdf)

---

## Como Compilar e Rodar o Projeto Localmente

### Pré-requisitos
* Java Development Kit (JDK) 17 ou superior
* Node.js e npm instalados
* PostgreSQL rodando localmente

### 1. Configuração local:
### 1.1 Configurando o Banco de Dados
Crie um banco de dados no PostgreSQL e atualize as credenciais no arquivo `application.properties` do Spring Boot:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nome_do_banco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```
### 1.2 Rodando o Backend
1. Navegue até a pasta do backend:
```
cd backend
```
2. Compile e rode a aplicação:
```
.\mvnw.cmd spring-boot:run
```
### 1.3 Rodando o Frontend
1. Navegue até a pasta do frontend:
```
cd frontend
```
2. Instale as dependências:
```
npm install
```
3. Inicie a aplicação React:
```
npm run dev
```

### 2. Acessando a Aplicação Implantada
- A aplicação se encontra disponível em: [https://sgb-frontend.vercel.app/](https://sistema-de-gerenciamento-de-bibliot-hazel.vercel.app/)



### Equipe de Desenvolvimento
<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/KayqueLopes99">
          <img src="https://github.com/KayqueLopes99.png" width="96" alt="Kayque Lopes" />
          <br/>
          <strong>José Kayque</strong>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/kaychenderson">
          <img src="https://github.com/kaychenderson.png" width="96" alt="Kayc Henderson" />
          <br/>
          <strong>Kayc Henderson</strong>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/isabellylimals">
          <img src="https://github.com/isabellylimals.png" width="96" alt="Maria Isabelly" />
          <br/>
          <strong>Maria Isabelly</strong>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/LeticiaVieirg">
          <img src="https://github.com/LeticiaVieirg.png" width="96" alt="Letícia Vieira" />
          <br/>
          <strong>Letícia Vieira</strong>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/MalluAlves">
          <img src="https://github.com/MalluAlves.png" width="96" alt="Maria Luiza" />
          <br/>
          <strong>Maria Luiza</strong>
        </a>
      </td>
    </tr>
  </table>
</div>
