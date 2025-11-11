import { generateEmbedding, generateEmbeddings } from './embeddings';

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function searchProfilesWithRAG(query, profiles, profileEmbeddings) {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const scoredProfiles = profiles.map((profile, index) => {
      const similarity = cosineSimilarity(queryEmbedding, profileEmbeddings[index]);
      return {
        ...profile,
        relevanceScore: Math.round(similarity * 100)
      };
    });

    return scoredProfiles
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter(p => p.relevanceScore > 20);

  } catch (error) {
    console.error('Error in RAG search:', error);
    throw error;
  }
}

export async function generateProfileEmbeddings(profiles) {
  try {
    const profileTexts = profiles.map(profile =>
      `${profile.name} ${profile.title} ${profile.skills.join(' ')} ${profile.summary} ${profile.location}`
    );

    const embeddings = await generateEmbeddings(profileTexts);
    return embeddings;

  } catch (error) {
    console.error('Error generating profile embeddings:', error);
    throw error;
  }
}