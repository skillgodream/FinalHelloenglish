// server/services/sheekoEngine.ts
// Re-exports from src/data/sheekoEngine for backend test & service isolation

export {
  parseLearnerStoryToMeaningRepresentation,
  synthesizeNaturalEnglishStory,
  applySheekoGrammarCorrections,
} from '../../src/data/sheekoEngine';

