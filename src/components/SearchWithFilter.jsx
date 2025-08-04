import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Text,
    StyleSheet
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { categories } from '../constants/categories';

const SearchWithFilter = ({ allItems, setFilteredItems }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [noItemsFound, setNoItemsFound] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilter(searchQuery, selectedFilter);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, selectedFilter]);

    const applyFilter = useCallback((text, categoryId) => {
        const filtered = allItems.filter((item) => {
            const matchesSearch = item.title?.toLowerCase().includes(text.toLowerCase());
            const matchesCategory = categoryId ? item.category === categoryId : true;
            return matchesSearch && matchesCategory;
        });

        setFilteredItems(filtered);
        setNoItemsFound(filtered.length === 0);
    }, [allItems]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedFilter(categoryId);
        setFilterVisible(false);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <View>
            {/* 🔍 Search Bar */}
            <View style={styles.searchBar}>
                <FontAwesome name="search" size={20} style={{ marginHorizontal: 10 }} />
                <TextInput
                    placeholder="Search Items"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                        <FontAwesome name="times-circle" size={20} color="#888" style={{ marginHorizontal: 5 }} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <FontAwesome name="filter" size={25} style={{ marginHorizontal: 10 }} />
                </TouchableOpacity>
            </View>

            {/* 🧾 Inline Horizontal Filter Bar */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.inlineFilterChips}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.chip,
                            selectedFilter === cat.id && styles.chipSelected,
                        ]}
                        onPress={() => handleCategoryFilter(cat.id)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                selectedFilter === cat.id && styles.chipTextSelected,
                            ]}
                        >
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Clear Inline Filter */}
                {selectedFilter !== "" && (
                    <TouchableOpacity
                        onPress={() => handleCategoryFilter("")}
                        style={[styles.chip, { borderColor: "#ff4444", backgroundColor: "#ffe5e5" }]}
                    >
                        <Text style={{ color: "#ff4444", fontWeight: "bold" }}>Clear</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* ❌ No Results Message */}
            {noItemsFound && (
                <Text style={{ textAlign: "center", marginTop: 10, color: "gray", fontStyle: "italic" }}>
                    No items found.
                </Text>
            )}

            {/* 🧾 Filter Modal */}
            <Modal
                visible={filterVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter by Category</Text>

                        <ScrollView contentContainerStyle={styles.filterChips}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.chip,
                                        selectedFilter === cat.id && styles.chipSelected,
                                    ]}
                                    onPress={() => handleCategoryFilter(cat.id)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedFilter === cat.id && styles.chipTextSelected,
                                        ]}
                                    >
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.clearBtn, { marginTop: 10 }]}
                            onPress={() => handleCategoryFilter("")}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>CLEAR FILTER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

};

export default SearchWithFilter;

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#001F54",
        marginBottom: 12,
    },
    filterChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    inlineFilterChips: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },

    chip: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    chipSelected: {
        backgroundColor: "#001F54",
        borderColor: "#001F54",
    },
    chipText: {
        fontSize: 14,
        color: "#333",
    },
    chipTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    clearBtn: {
        backgroundColor: "#ff4444",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
});
