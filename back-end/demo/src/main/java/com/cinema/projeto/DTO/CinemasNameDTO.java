package com.cinema.projeto.DTO;

public class CinemasNameDTO {
		
	 private Long id;
	 private String nomeFantasia;

	    public CinemasNameDTO(Long id, String nomeFantasia) {
	        this.id = id;
	        this.nomeFantasia = nomeFantasia;
	    }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getNomeFantasia() {
			return nomeFantasia;
		}

		public void setNomeFantasia(String nomeFantasia) {
			this.nomeFantasia = nomeFantasia;
		}
	    
	    
}
