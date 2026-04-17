import { getApiKey } from "@/lib/authStore";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const REGIONS = [
  { label: "India", value: "in" },
  { label: "USA", value: "us" },
  { label: "UK", value: "uk" },
  { label: "Europe", value: "eu" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "Global", value: "xx" },
];

// Mapped to the specific strings from your console.log
const CATEGORY = [
  { label: "All Items", value: "all" },
  { label: "Grants", value: "ShopItem::HCBGrant" },
  { label: "HQ Items", value: "ShopItem::HQMailItem" },
  { label: "Digital", value: "ShopItem::ThirdPartyDigital" },
  { label: "Accessories", value: "ShopItem::Accessory" },
  { label: "Stickers", value: "ShopItem::FreeStickers" },
  { label: "Warehouse", value: "ShopItem::WarehouseItem" },
  { label: "Hack Clubber Made", value: "ShopItem::HackClubberItem" },
  { label: "Silly Items", value: "ShopItem::SillyItemType" },
];

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("in");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchShopItems = async () => {
    try {
      const storedKey = await getApiKey();
      const response = await fetch("https://flavortown.hackclub.com/api/v1/store", {
        headers: { "Authorization": `Bearer ${storedKey}` }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Shop fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchShopItems(); 
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
        
        return item.buyable_by_self && matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const priceA = a.ticket_cost?.[selectedRegion] || a.ticket_cost?.base_cost || 0;
        const priceB = b.ticket_cost?.[selectedRegion] || b.ticket_cost?.base_cost || 0;
        return priceA - priceB;
      });
  }, [items, searchQuery, selectedRegion, selectedCategory]);

  const renderItem = ({ item }: { item: any }) => {
    const isEnabledInRegion = item.enabled?.[`enabled_${selectedRegion}`];
    const itemPrice = item.ticket_cost?.[selectedRegion] || item.ticket_cost?.base_cost;

    return (
      <View 
        className={`bg-card mb-4 rounded-3xl overflow-hidden border border-white/10 ${!isEnabledInRegion ? 'opacity-50' : ''}`}
      >
        <Image 
          source={{ uri: item.image_url || "https://flavortown.hackclub.com/assets/default-prize.png" }} 
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-xl flex-1" style={{ fontFamily: "Jua_400Regular" }}>
              {item.name}
            </Text>
            <View className="bg-[#ec8b34] px-3 py-1 rounded-full">
              <Text className="text-white font-bold">🍪 {itemPrice}</Text>
            </View>
          </View>
          
          <Text className="text-gray-300 text-sm mb-4 leading-5" numberOfLines={3}>
            {item.description}
          </Text>
          
          <TouchableOpacity 
            disabled={!isEnabledInRegion}
            onPress={() => Linking.openURL(`https://flavortown.hackclub.com/shop/order?shop_item_id=${item.id}`)}
            className={`py-3 rounded-xl items-center ${isEnabledInRegion ? 'bg-[#ec8b34]' : 'bg-gray-600'}`}
          >
            <Text className="text-white font-bold">
              {isEnabledInRegion ? "View in Shop" : "Not Available in Region"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <View className="flex-1 px-6 pt-20">
        <Text className="text-4xl text-white mb-6 text-center" style={{ fontFamily: "Jua_400Regular" }}>
          The Shop
        </Text>

        <View className="bg-card rounded-2xl mb-4 border border-white/10 overflow-hidden flex flex-col">
          {/* Technical Type Picker */}
          <View className="border-b border-white/5">
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={{ color: '#fff' }}
              dropdownIconColor="#ec8b34"
            >
              {CATEGORY.map((c) => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker>
          </View>

          {/* Region Picker */}
          <Picker
            selectedValue={selectedRegion}
            onValueChange={(itemValue) => setSelectedRegion(itemValue)}
            style={{ color: '#fff' }}
            dropdownIconColor="#ec8b34"
          >
            {REGIONS.map((r) => (
              <Picker.Item key={r.value} label={r.label} value={r.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-card text-white p-4 rounded-2xl mb-6 border border-white/10"
          style={{ fontFamily: "Jua_400Regular" }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#ec8b34" className="mt-20" />
        ) : (
          <FlatList
            data={filteredAndSortedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <Text className="text-white text-center mt-10">No items found matching this category.</Text>
            }
          />
        )}
      </View>
    </ImageBackground>
  );
}