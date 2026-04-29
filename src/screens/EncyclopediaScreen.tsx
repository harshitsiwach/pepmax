import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../store/useUserStore';
import { PeptideCard } from '../components/PeptideCard';
import { colors, spacing, borderRadius } from '../utils/theme';
import { getAllPeptides, getAllCategories, searchPeptides, getPeptidesByCategory } from '../utils/db';
import { filterLegalPeptides } from '../utils/legalFilter';
import { Peptide } from '../types';
import { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function EncyclopediaScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode, country } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = getAllCategories();
  
  const peptides = useMemo(() => {
    let results: Peptide[];
    
    if (searchQuery) {
      results = searchPeptides(searchQuery);
    } else if (selectedCategory) {
      results = getPeptidesByCategory(selectedCategory);
    } else {
      results = getAllPeptides();
    }
    
    return filterLegalPeptides(results, country);
  }, [searchQuery, selectedCategory, country]);

  const handlePeptidePress = (peptide: Peptide) => {
    navigation.navigate('PeptideDetail', { peptideId: peptide.name });
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>Encyclopedia</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          {peptides.length} peptides available
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder="Search peptides..."
          placeholderTextColor={c.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={[styles.clearButton, { color: c.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categories}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === item.id ? c.primary : c.surface,
                  borderColor: c.border,
                },
              ]}
              onPress={() => handleCategoryPress(item.id)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  { color: selectedCategory === item.id ? '#FFFFFF' : c.text },
                ]}
              >
                {item.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={peptides}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PeptideCard peptide={item} onPress={() => handlePeptidePress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: c.textMuted }]}>
              No peptides found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    fontSize: 16,
    padding: spacing.xs,
  },
  categories: {
    paddingVertical: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginLeft: spacing.md,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});