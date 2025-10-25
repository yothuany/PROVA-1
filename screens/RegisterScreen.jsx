// screens/RegisterScreen.jsx - DEBUG COMPLETO DO REGISTRO
import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ActivityIndicator 
} from "react-native";
import { register } from "../services/api";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        console.log("🎯 === INICIANDO REGISTRO ===");
        console.log("📝 Dados:", { username, password });
        
        if (!username.trim() || !password.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        setIsLoading(true);

        try {
            console.log("📤 CHAMANDO API DE REGISTRO...");
            const result = await register(username, password);
            console.log("✅ REGISTRO BEM-SUCEDIDO:", result);
            
            Alert.alert("Sucesso", "Usuário registrado com sucesso!");
            navigation.navigate("Login");
            
        } catch (error) {
            console.error("❌ ERRO NO REGISTRO COMPLETO:", error);
            
            // DEBUG DETALHADO
            if (error.response) {
                console.log("📊 STATUS:", error.response.status);
                console.log("📦 DATA:", error.response.data);
                console.log("📋 HEADERS:", error.response.headers);
                
                if (error.response.status === 409) {
                    Alert.alert("Erro", "Usuário já existe");
                } else if (error.response.status === 400) {
                    Alert.alert("Erro", "Dados inválidos");
                } else {
                    Alert.alert("Erro", `Status: ${error.response.status}`);
                }
            } else if (error.request) {
                console.log("🌐 ERRO DE REDE - SEM RESPOSTA");
                Alert.alert("Erro", "API não respondeu");
            } else {
                console.log("⚡ OUTRO ERRO:", error.message);
                Alert.alert("Erro", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // TESTE DIRETO DA API
    const testAPIDirectly = async () => {
        console.log("🔍 TESTANDO API DIRETAMENTE...");
        
        const testData = {
            username: "teste_" + Date.now(),
            password: "123456"
        };
        
        try {
            const response = await fetch('http://localhost:4000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });
            
            console.log("📥 RESPOSTA DA API:");
            console.log("Status:", response.status);
            console.log("OK:", response.ok);
            
            const text = await response.text();
            console.log("Texto:", text);
            
            Alert.alert("Teste API", `Status: ${response.status}\nResposta: ${text}`);
            
        } catch (error) {
            console.error("❌ TESTE FALHOU:", error);
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                editable={!isLoading}
            />
            
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Registrar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.testButton]}
                onPress={testAPIDirectly}
            >
                <Text style={styles.buttonText}>Testar API</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#FFF",
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: "#CCCCCC",
    },
    testButton: {
        backgroundColor: "#FF9800",
    },
    loginButton: {
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});