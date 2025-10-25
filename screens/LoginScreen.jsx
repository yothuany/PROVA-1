// screens/LoginScreen.jsx
import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ActivityIndicator,
    ScrollView 
} from "react-native";
import { login } from "../services/api";

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        console.log("🚀 INICIANDO PROCESSO DE LOGIN");
        console.log("📝 Dados:", { username, password });
        
        if (!username.trim() || !password.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        setIsLoading(true);

        try {
            console.log("📤 ENVIANDO REQUISIÇÃO PARA API...");
            const result = await login(username, password);
            console.log("🎉 LOGIN BEM-SUCEDIDO:", result);
            
            Alert.alert("Sucesso", "Login realizado com sucesso!");
            navigation.navigate("Home", { token: result.token });
            
        } catch (error) {
            console.error("💥 ERRO COMPLETO NO LOGIN:", error);
            
            let errorMessage = "Erro desconhecido";
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                console.log("📊 Status HTTP:", status);
                console.log("📋 Dados do erro:", data);
                
                if (status === 401) {
                    errorMessage = "Credenciais inválidas. Verifique seu usuário e senha.";
                } else if (status === 400) {
                    errorMessage = "Dados inválidos. Verifique as informações.";
                } else if (status === 404) {
                    errorMessage = "Serviço não encontrado.";
                } else if (status === 500) {
                    errorMessage = "Erro interno do servidor. Tente novamente.";
                } else {
                    errorMessage = data?.error || `Erro ${status}`;
                }
            } else if (error.request) {
                console.log("🌐 ERRO DE REDE - Sem resposta do servidor");
                errorMessage = "Não foi possível conectar ao servidor.\n\nVerifique:\n• Se a API está rodando\n• Sua conexão com a internet";
            } else {
                errorMessage = error.message || "Erro inesperado";
            }
            
            Alert.alert("Erro no Login", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
            
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome de usuário"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                />
                
                <TouchableOpacity 
                    style={[
                        styles.loginButton, 
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Text style={styles.loginButtonText}>
                            Entrar
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Não tem uma conta?
                </Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("Register")}
                    disabled={isLoading}
                >
                    <Text style={styles.registerLink}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#F8FAFC",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: "#1E293B",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 40,
        color: "#64748B",
    },
    form: {
        marginBottom: 40,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#FFF",
        fontSize: 16,
        color: "#1E293B",
    },
    loginButton: {
        height: 56,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: "#94A3B8",
        shadowOpacity: 0,
    },
    loginButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    footerText: {
        color: "#64748B",
        fontSize: 14,
    },
    registerLink: {
        color: "#10B981",
        fontSize: 14,
        fontWeight: "bold",
    },
});