// Conteúdo do quiz. Todas as informações vêm das fontes NASA e Britannica.
window.QUIZ = {
  tempoPorPergunta: 10,   // segundos
  transicaoSeg: 3,        // segundos entre perguntas, com a curiosidade na tela

  perguntas: [
    {
      texto: "Qual filme retrata a história dessas mulheres?",
      opcoes: ["Estrelas Além do Tempo", "Apollo 13", "Gravidade", "O Primeiro Homem"],
      correta: 0,
      curiosidade: "O filme é baseado no livro de Margot Lee Shetterly."
    },
    {
      texto: "Em que ano Mary Jackson se tornou a primeira engenheira negra da NASA?",
      opcoes: ["1942", "1951", "1958", "1961"],
      correta: 2,
      curiosidade: "Mary Jackson trabalhou no túnel de vento supersônico do Langley."
    },
    {
      texto: "Em 1961, Katherine Johnson calculou a trajetória de qual voo espacial americano?",
      opcoes: ["Apollo 11", "Friendship 7", "Freedom 7", "Sputnik"],
      correta: 2,
      curiosidade: "Depois, em 1962, John Glenn pediu que ela conferisse os cálculos do Friendship 7."
    },
    {
      texto: "Em 1949, Dorothy Vaughan se tornou chefe de um grupo de computação. Como era esse grupo?",
      opcoes: [
        "Só engenheiros homens",
        "Só mulheres negras matemáticas",
        "Grupo misto de cientistas",
        "Só brancos com formação em física"
      ],
      correta: 1,
      curiosidade: "Dorothy Vaughan liderou o grupo, segregado, até 1958, quando o NACA virou NASA."
    },
    {
      texto: "Em que linguagem de programação Dorothy Vaughan se tornou especialista?",
      opcoes: ["COBOL", "FORTRAN", "Pascal", "Java"],
      correta: 1,
      curiosidade: "Dorothy Vaughan se tornou uma das maiores especialistas em FORTRAN da NASA."
    }
  ],

  // Fichas mostradas na tela final
  fichas: [
    {
      nome: "Dorothy Vaughan",
      anos: "1910 – 2008",
      texto: "Matemática e programadora. Em 1949, tornou-se a primeira supervisora negra do NACA. Depois, especializou-se em FORTRAN."
    },
    {
      nome: "Katherine Johnson",
      anos: "1918 – 2020",
      texto: "Calculou trajetórias de voos como o Freedom 7 (1961) e o Friendship 7 (1962). Recebeu a Medalha Presidencial da Liberdade em 2015."
    },
    {
      nome: "Mary W. Jackson",
      anos: "1921 – 2005",
      texto: "Em 1958, tornou-se a primeira engenheira negra da NASA. Estudou o fluxo de ar ao redor de aeronaves."
    }
  ]
};
