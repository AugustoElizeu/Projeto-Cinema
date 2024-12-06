package com.cinema.projeto.Enums;

public enum Genero {
	 	
		ACAO("Ação"),
	    AVENTURA("Aventura"),
	    COMEDIA("Comédia"),
	    DRAMA("Drama"),
	    FANTASIA("Fantasia"),
	    ROMANCE("Romance"),
	    TERROR("Terror"),
	    FICCAO_CIENTIFICA("Ficção Científica"),
	    MISTERO("Mistério"),
	    DOCUMENTARIO("Documentário"),
	    ANIMACAO("Animação");

	    private final String descricao;

	    // Construtor para associar a descrição ao gênero
	    Genero(String descricao) {
	        this.descricao = descricao;
	    }

	    // Método para obter a descrição do gênero
	    public String getDescricao() {
	        return descricao;
	    }

	    @Override
	    public String toString() {
	        return descricao;
	    }
	
}
