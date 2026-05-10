package com.biblioteca.gerenciador.util;


public class CpfValidator {

    public static boolean isValid(String cpf) {
        if (cpf == null) return false;
        
        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int d1 = calcularDigito(cpf.substring(0, 9), 10);
            int d2 = calcularDigito(cpf.substring(0, 9) + d1, 11);
            return cpf.equals(cpf.substring(0, 9) + d1 + d2);
        } catch (Exception e) {
            return false;
        }
    }

    private static int calcularDigito(String str, int peso) {
        int soma = 0;
        for (int i = 0; i < str.length(); i++) {
            soma += Integer.parseInt(str.substring(i, i + 1)) * peso--;
        }
        int resto = soma % 11;
        return (resto < 2) ? 0 : 11 - resto;
    }
}