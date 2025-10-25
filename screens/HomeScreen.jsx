// screens/HomeScreen.jsx - COM DEBUG COMPLETO
import React, { useState, useEffect, useCallback } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator,
    ScrollView 
} from "react-native";
import ItemList from "../components/ItemList";
import { getItems, createItem, updateItem, deleteItem } from "../services/api";

export default function HomeScreen({ route, navigation }) {
    console.log("🏠 === HOME SCREEN INICIADA ===");
    console.log("🔑 Token recebido:", route.params?.token ? "SIM" : "NÃO");
    
    const { token } = route.params;
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        console.log("📦 USE EFFECT - CARREGANDO ITENS...");
        loadItems();
    }, [token]);

    const loadItems = async () => {
        console.log("🔄 LOAD ITEMS - INICIANDO...");
        setIsLoading(true);
        try {
            console.log("📤 BUSCANDO ITENS DA API...");
            const data = await getItems(token);
            console.log("✅ ITENS CARREGADOS:", data);
            setItems(data);
        } catch (error) {
            console.error("❌ ERRO AO CARREGAR ITENS:", error);
            Alert.alert("Erro", "Não foi possível carregar os itens.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateItem = useCallback(async () => {
        if (!newItemName.trim()) {
            Alert.alert("Atenção", "O nome do item não pode ser vazio.");
            return;
        }
        
        setIsActionLoading(true);
        try {
            console.log("➕ CRIANDO ITEM:", newItemName);
            const newItem = await createItem(newItemName.trim(), token);
            console.log("✅ ITEM CRIADO:", newItem);
            setItems((prev) => [...prev, newItem]);
            setNewItemName("");
        } catch (error) {
            console.error("❌ ERRO AO CRIAR ITEM:", error);
            Alert.alert("Erro", "Não foi possível criar o item.");
        } finally {
            setIsActionLoading(false);
        }
    }, [newItemName, token]);

    const handleUpdateItem = useCallback(async () => {
        if (!editingItem || !newItemName.trim()) {
            Alert.alert("Atenção", "O nome do item não pode ser vazio.");
            return;
        }
        
        setIsActionLoading(true);
        try {
            console.log("✏️ ATUALIZANDO ITEM:", editingItem.id);
            const updatedItem = await updateItem(editingItem.id, newItemName.trim(), token);
            setItems((prev) =>
                prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );
            setEditingItem(null);
            setNewItemName("");
        } catch (error) {
            console.error("❌ ERRO AO ATUALIZAR ITEM:", error);
            Alert.alert("Erro", "Não foi possível atualizar o item.");
        } finally {
            setIsActionLoading(false);
        }
    }, [editingItem, newItemName, token]);

    const handleDeleteItem = useCallback(async (id) => {
        try {
            console.log("🗑️ DELETANDO ITEM:", id);
            await deleteItem(id, token);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("❌ ERRO AO EXCLUIR ITEM:", error);
            Alert.alert("Erro", "Não foi possível excluir o item.");
        }
    }, [token]);

    const handleEditItem = (item) => {
        setEditingItem(item);
        setNewItemName(item.name);
    };

    const handleLogout = () => {
        navigation.navigate("Login");
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setNewItemName("");
    };

    console.log("🎨 RENDERIZANDO HOME SCREEN...");
    console.log("📊 ESTADO ATUAL:", {
        itemsCount: items.length,
        isLoading,
        editingItem: editingItem ? editingItem.name : "Nenhum",
        newItemName
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.loadingText}>Carregando itens...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Itens</Text>
            
            <Text style={styles.subtitle}>
                {items.length} {items.length === 1 ? 'item' : 'itens'} encontrados
            </Text>

            {/* DEBUG INFO */}
            <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                    Token: {token ? "✅ Presente" : "❌ Ausente"}
                </Text>
                <Text style={styles.debugText}>
                    Itens: {items.length}
                </Text>
            </View>

            <ItemList items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />
            
            <TextInput
                style={styles.input}
                placeholder="Nome do item"
                value={newItemName}
                onChangeText={setNewItemName}
                editable={!isActionLoading}
            />
            
            <TouchableOpacity
                style={styles.button}
                onPress={editingItem ? handleUpdateItem : handleCreateItem}
                disabled={isActionLoading}
            >
                {isActionLoading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>
                        {editingItem ? "Atualizar Item" : "Criar Item"}
                    </Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: "#666",
        textAlign: "center",
    },
    debugInfo: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    debugText: {
        fontSize: 12,
        color: "#666",
    },
    input: {
        height: 50,
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#FFF",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#6200EE",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: "#B00020",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});