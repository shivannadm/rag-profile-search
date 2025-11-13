import React, { useState } from 'react';
import { Search, User, Briefcase, Mail, Phone, MapPin, Award, Loader2, Database, Brain, AlertCircle } from 'lucide-react';
import profilesData from './data/profiles.json';

export default function RAGProfileSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exactMatches, setExactMatches] = useState([]);
  const [relevantMatches, setRelevantMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchStats, setSearchStats] = useState(null);

  // Extract experience from query
  const extractExperience = (query) => {
    const lowerQuery = query.toLowerCase();

    // Direct number: "2", "3", "4"
    const directNumber = query.match(/^\d+$/);
    if (directNumber) {
      return parseInt(directNumber[0]);
    }

    // Pattern: "8+ years", "8 years", "8+"
    const plusPattern = /(\d+)\+?\s*(years?|yrs?|year|yr)?/i;
    const match = lowerQuery.match(plusPattern);
    if (match) {
      return parseInt(match[1]);
    }

    // Seniority keywords
    if (lowerQuery.includes('senior')) return 8;
    if (lowerQuery.includes('lead')) return 10;
    if (lowerQuery.includes('principal') || lowerQuery.includes('staff')) return 12;
    if (lowerQuery.includes('junior') || lowerQuery.includes('entry')) return 2;

    return null;
  };

  // TRUE RAG Search with Exact + Relevant
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setExactMatches([]);
      setRelevantMatches([]);
      return;
    }

    setIsSearching(true);
    const startTime = performance.now();

    try {
      const query = searchQuery.toLowerCase().trim();
      const experience = extractExperience(query);

      // STEP 1: Find EXACT matches
      const exact = profilesData.filter(profile => {
        // Check domain (exact match)
        if (profile.domain && profile.domain.toLowerCase() === query) {
          return true;
        }

        // Check name (exact match)
        if (profile.name.toLowerCase() === query) {
          return true;
        }

        // Check location (exact match)
        if (profile.location.toLowerCase() === query) {
          return true;
        }

        // Check skills (exact match)
        const hasSkill = profile.skills.some(skill =>
          skill.toLowerCase() === query
        );
        if (hasSkill) {
          return true;
        }

        // Check experience (exact match for numbers like "2", "3", "8")
        if (experience !== null && !query.includes('+') && !query.includes('year')) {
          if (profile.experience === experience) {
            return true;
          }
        }

        // Check experience with "+" (8+ means >= 8)
        if (experience !== null && (query.includes('+') || query.includes('senior') || query.includes('lead'))) {
          if (profile.experience >= experience) {
            return true;
          }
        }

        return false;
      });

      // STEP 2: Find RELEVANT matches (if no exact matches or for RAG behavior)
      let relevant = [];
      if (exact.length === 0 || exact.length < 5) {
        relevant = profilesData
          .filter(profile => !exact.some(e => e.id === profile.id)) // Exclude exact matches
          .map(profile => {
            let score = 0;
            const searchTerms = query.split(' ').filter(t => t.length > 2);

            // Score by domain similarity
            if (profile.domain) {
              const domainWords = profile.domain.toLowerCase().split(' ');
              searchTerms.forEach(term => {
                if (domainWords.some(word => word.includes(term) || term.includes(word))) {
                  score += 5;
                }
              });
            }

            // Score by skills
            profile.skills.forEach(skill => {
              const skillLower = skill.toLowerCase();
              searchTerms.forEach(term => {
                if (skillLower.includes(term) || term.includes(skillLower)) {
                  score += 3;
                }
              });
            });

            // Score by title
            const titleLower = profile.title.toLowerCase();
            searchTerms.forEach(term => {
              if (titleLower.includes(term)) {
                score += 2;
              }
            });

            // Score by summary
            const summaryLower = profile.summary.toLowerCase();
            searchTerms.forEach(term => {
              if (summaryLower.includes(term)) {
                score += 1;
              }
            });

            // Score by location partial match
            if (profile.location.toLowerCase().includes(query) || query.includes(profile.location.toLowerCase())) {
              score += 2;
            }

            // Score by name partial match
            if (profile.name.toLowerCase().includes(query) || query.includes(profile.name.toLowerCase())) {
              score += 2;
            }

            // Experience proximity scoring
            if (experience !== null) {
              const diff = Math.abs(profile.experience - experience);
              if (diff <= 2) score += 3;
              else if (diff <= 5) score += 1;
            }

            return { ...profile, relevanceScore: score };
          })
          .filter(p => p.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 10);
      }

      const endTime = performance.now();

      setExactMatches(exact);
      setRelevantMatches(relevant);
      setSearchStats({
        totalProfiles: profilesData.length,
        searchTime: (endTime - startTime).toFixed(2),
        exactCount: exact.length,
        relevantCount: relevant.length
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RAG Profile Search</h1>
                <p className="text-gray-600">Exact matches + Relevant suggestions powered by RAG</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                🎯 Smart RAG Search
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {profilesData.length} profiles Extracted
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Tips */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🔍 Search by:</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm text-blue-800">
            <div>
              <strong>Domain:</strong> "Machine Learning"
            </div>
            <div>
              <strong>Skills:</strong> "Python", "React"
            </div>
            <div>
              <strong>Name:</strong> "Raj Patel"
            </div>
            <div>
              <strong>Location:</strong> "San Francisco"
            </div>
            <div>
              <strong>Experience:</strong> "8+", "5", "senior"
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by domain, skills, name, location, or experience... (e.g., 'Machine Learning', 'Python', 'San Francisco', '8+')"
              className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              disabled={isSearching}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Search Stats */}
          {searchStats && (
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                {searchStats.totalProfiles} total profiles
              </span>
              <span>•</span>
              <span className="font-semibold text-green-600">{searchStats.exactCount} exact matches</span>
              <span>•</span>
              <span className="font-semibold text-blue-600">{searchStats.relevantCount} relevant matches</span>
              <span>•</span>
              <span>Search time: {searchStats.searchTime}ms</span>
            </div>
          )}
        </div>

        {/* EXACT MATCHES */}
        {exactMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                ✅ Exact Matches ({exactMatches.length})
              </h2>
            </div>

            <div className="space-y-4">
              {exactMatches.map((profile, index) => (
                <div
                  key={profile.id}
                  className="bg-white border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedProfile(selectedProfile?.id === profile.id ? null : profile)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-blue-600 font-medium">{profile.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Award className="w-4 h-4" />
                        Exact Match
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Rank #{index + 1}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{profile.summary}</p>

                  {/* Domain Badge */}
                  {profile.domain && (
                    <div className="mb-3">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {profile.domain}
                      </span>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {/* {profile.skills.length > 6 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        +{profile.skills.length - 6} more
                      </span>
                    )} */}
                  </div>

                  {selectedProfile?.id === profile.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.experience} years experience</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600"><strong>All Skills:</strong></p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.skills.map((skill, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(selectedProfile?.id === profile.id ? null : profile);
                    }}
                  >
                    {selectedProfile?.id === profile.id ? 'Show less' : 'Show more details'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NO MATCH MESSAGE + RELEVANT MATCHES */}
        {exactMatches.length === 0 && searchQuery && !isSearching && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 mb-1">No Exact Match Found</h3>
                  <p className="text-yellow-800">
                    No profiles exactly match "<strong>{searchQuery}</strong>".
                    {relevantMatches.length > 0 && " Here are some relevant matches based on your search:"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RELEVANT MATCHES */}
        {relevantMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                💡 Relevant Matches ({relevantMatches.length})
              </h2>
            </div>

            <div className="space-y-4">
              {relevantMatches.map((profile, index) => (
                <div
                  key={profile.id}
                  className="bg-white border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedProfile(selectedProfile?.id === profile.id ? null : profile)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-blue-600 font-medium">{profile.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Award className="w-4 h-4" />
                        {Math.min(99, profile.relevanceScore * 10)}% Relevant
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Rank #{index + 1}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{profile.summary}</p>

                  {/* Domain Badge */}
                  {profile.domain && (
                    <div className="mb-3">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {profile.domain}
                      </span>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        +{profile.skills.length - 6} more
                      </span>
                    )}
                  </div>

                  {selectedProfile?.id === profile.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile.experience} years experience</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600"><strong>All Skills:</strong></p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.skills.map((skill, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(selectedProfile?.id === profile.id ? null : profile);
                    }}
                  >
                    {selectedProfile?.id === profile.id ? 'Show less' : 'Show more details'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!exactMatches.length && !relevantMatches.length && !isSearching && !searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Start Your RAG-Powered Search
            </h3>
            <p className="text-gray-500 mb-8">
              Get exact matches and relevant suggestions based on your query
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Machine Learning',
                  'Python',
                  'San Francisco',
                  '8+',
                  'React',
                  'Raj Patel'
                ].map(example => (
                  <button
                    key={example}
                    onClick={() => {
                      setSearchQuery(example);
                      setTimeout(handleSearch, 100);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
