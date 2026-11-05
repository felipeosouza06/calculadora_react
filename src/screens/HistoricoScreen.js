import { useState } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { salvar } from "../storage/historico";

// o id do item e o Date.now() de quando a conta foi feita
function formatarData(id) {
  const data = new Date(Number(id));
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${hora}:${minuto}`;
}

export default function HistoricoScreen({ route, navigation }) {
  // a lista vira estado para a tela atualizar quando uma conta for excluida
  const [lista, setLista] = useState(route.params.historico);

  // filter cria uma lista nova, sem mexer na que ja esta no estado
  async function excluir(id) {
    const nova = lista.filter((item) => item.id !== id);
    setLista(nova);
    await salvar(nova);
  }

  // popTo volta para a Home que ja existe, em vez de empilhar outra.
  // o "toque" muda a cada vez, entao tocar na mesma conta de novo tambem funciona
  function reutilizar(item) {
    navigation.popTo("Home", { valor: item.resultado, toque: Date.now() });
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      data={lista}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        lista.length > 0 && (
          <Text style={styles.titulo}>
            {lista.length} {lista.length === 1 ? "conta" : "contas"} salvas
          </Text>
        )
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => reutilizar(item)}
        >
          <View style={styles.topo}>
            <Text style={styles.data}>{formatarData(item.id)}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.excluir,
                pressed && styles.pressionado,
              ]}
              onPress={() => excluir(item.id)}
            >
              <Text style={styles.textExcluir}>Excluir</Text>
            </Pressable>
          </View>
          <Text style={styles.conta}>{item.conta}</Text>
          <Text style={styles.resultado}>= {item.resultado}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Seu histórico está vazio</Text>
          <Text style={styles.vazioTexto}>
            As contas finalizadas com "=" vão ficar guardadas aqui.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: "#000000",
  },

  conteudo: {
    padding: 16,
  },

  titulo: {
    color: "#8C8C8C",
    fontSize: 14,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#34D399",
  },

  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  data: {
    color: "#737373",
    fontSize: 12,
  },

  excluir: {
    borderWidth: 1,
    borderColor: "#7F1D1D",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  textExcluir: {
    color: "#F87171",
    fontSize: 13,
    fontWeight: "600",
  },

  pressionado: {
    opacity: 0.6,
  },

  conta: {
    color: "#BFBFBF",
    fontSize: 18,
    textAlign: "right",
  },

  resultado: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
  },

  vazio: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 30,
  },

  vazioTitulo: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },

  vazioTexto: {
    color: "#8C8C8C",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
