import React, { useState, useEffect } from 'react';
import { Search, User, Briefcase, Mail, Phone, MapPin, Award, Loader2, Database, Brain, Download, AlertCircle } from 'lucide-react';

// Sample Dataset - Replace this with CSV loaded data
const SAMPLE_PROFILES = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1-555-0101",
    category: "Full Stack Developer",
    skills: "React, Node.js, Python, AWS, Docker, PostgreSQL, Machine Learning, TypeScript, MongoDB, Redis",
    experience: "8 years",
    location: "San Francisco, CA",
    education: "MS Computer Science, Stanford University",
    summary: "Experienced full stack developer with expertise in building scalable web applications. Strong background in cloud architecture and ML integration. Led teams of 5+ developers on enterprise projects.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1-555-0102",
    category: "DevOps Engineer",
    skills: "Kubernetes, CI/CD, Terraform, AWS, Python, Monitoring, Security, Jenkins, Ansible, Prometheus",
    experience: "6 years",
    location: "Austin, TX",
    education: "BS Software Engineering, UT Austin",
    summary: "DevOps specialist focused on infrastructure automation and security. Proven track record of reducing deployment times by 60% and improving system reliability. Expert in cloud infrastructure.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+1-555-0103",
    category: "Data Scientist",
    skills: "Python, TensorFlow, PyTorch, SQL, Statistics, NLP, Computer Vision, Scikit-learn, Pandas, NumPy",
    experience: "5 years",
    location: "New York, NY",
    education: "PhD Data Science, MIT",
    summary: "Data scientist specializing in NLP and computer vision. Experience with large-scale ML model deployment and optimization. Published researcher with 10+ papers in AI conferences.",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    phone: "+1-555-0104",
    category: "Frontend Developer",
    skills: "React, TypeScript, Next.js, CSS, UI/UX, Redux, GraphQL, Tailwind, Webpack, Jest",
    experience: "4 years",
    location: "Seattle, WA",
    education: "BS Computer Science, University of Washington",
    summary: "Frontend developer passionate about creating beautiful, accessible user interfaces. Strong focus on performance optimization and user experience. Winner of 3 hackathons.",
  },
  {
    id: 5,
    name: "Emily Watson",
    email: "emily.watson@email.com",
    phone: "+1-555-0105",
    category: "Backend Engineer",
    skills: "Java, Spring Boot, Microservices, PostgreSQL, Redis, Kafka, API Design, Hibernate, Maven, JUnit",
    experience: "7 years",
    location: "Boston, MA",
    education: "MS Software Engineering, MIT",
    summary: "Backend engineer with deep expertise in microservices architecture and distributed systems. Focus on building robust, high-performance APIs handling 100k+ requests per second.",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1-555-0106",
    category: "Mobile Developer",
    skills: "React Native, iOS, Android, Swift, Kotlin, Firebase, Mobile UI, Flutter, Xcode, Android Studio",
    experience: "5 years",
    location: "Los Angeles, CA",
    education: "BS Computer Engineering, UCLA",
    summary: "Mobile developer experienced in building cross-platform applications. Strong understanding of mobile design patterns and app store optimization. Apps with 1M+ downloads.",
  },
  {
    id: 7,
    name: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    phone: "+1-555-0107",
    category: "Cloud Architect",
    skills: "AWS, Azure, GCP, Serverless, Infrastructure, Cost Optimization, Security, Lambda, CloudFormation, IAM",
    experience: "10 years",
    location: "Chicago, IL",
    education: "MS Cloud Computing, Carnegie Mellon",
    summary: "Cloud architect with extensive experience in multi-cloud environments. Specialized in cost optimization saving companies $500k+ annually and security best practices.",
  },
  {
    id: 8,
    name: "Raj Patel",
    email: "raj.patel@email.com",
    phone: "+1-555-0108",
    category: "AI/ML Engineer",
    skills: "Python, Deep Learning, MLOps, TensorFlow, Kubernetes, Model Deployment, Research, BERT, Transformers, Hugging Face",
    experience: "6 years",
    location: "San Jose, CA",
    education: "MS Artificial Intelligence, Stanford",
    summary: "AI/ML engineer focused on production ML systems. Experience with model optimization, deployment pipelines, and MLOps best practices. Contributed to 5+ open-source AI projects.",
  },
  {
    id: 9,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1-555-0109",
    category: "Product Manager",
    skills: "Product Strategy, Agile, Scrum, User Research, Analytics, Roadmapping, Jira, Figma, SQL, A/B Testing",
    experience: "9 years",
    location: "San Francisco, CA",
    education: "MBA, Harvard Business School",
    summary: "Product manager with track record of launching successful products. Led 0-to-1 product launches generating $10M+ revenue. Data-driven decision maker with strong technical background.",
  },
  {
    id: 10,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0110",
    category: "Security Engineer",
    skills: "Cybersecurity, Penetration Testing, Security Audits, SIEM, Firewall, IDS/IPS, Threat Intelligence, Encryption, Compliance",
    experience: "8 years",
    location: "Washington, DC",
    education: "MS Cybersecurity, Georgia Tech",
    summary: "Security engineer specializing in application security and infrastructure hardening. CISSP certified. Conducted 100+ security audits for Fortune 500 companies.",
  },
  {
    id: 11,
    name: "Sophia Martinez",
    email: "sophia.martinez@email.com",
    phone: "+1-555-0111",
    category: "UX/UI Designer",
    skills: "Figma, Adobe XD, User Research, Prototyping, Wireframing, Design Systems, Sketch, InVision, Usability Testing",
    experience: "6 years",
    location: "Portland, OR",
    education: "BFA Design, Rhode Island School of Design",
    summary: "UX/UI designer passionate about human-centered design. Created design systems used by teams of 50+ designers. Work featured in major design publications.",
  },
  {
    id: 12,
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1-555-0112",
    category: "Database Administrator",
    skills: "PostgreSQL, MySQL, MongoDB, Oracle, Database Design, Performance Tuning, Backup Recovery, SQL, NoSQL, Redis",
    experience: "11 years",
    location: "Dallas, TX",
    education: "BS Information Systems, University of Texas",
    summary: "Database administrator with expertise in high-availability systems. Managed databases handling 10TB+ data with 99.99% uptime. Oracle and PostgreSQL certified.",
  },
  {
    id: 13,
    name: "Olivia Davis",
    email: "olivia.davis@email.com",
    phone: "+1-555-0113",
    category: "QA Engineer",
    skills: "Selenium, Automation Testing, Manual Testing, Cypress, Jest, JUnit, Test Planning, Bug Tracking, CI/CD, API Testing",
    experience: "5 years",
    location: "Atlanta, GA",
    education: "BS Computer Science, Georgia Tech",
    summary: "QA engineer specializing in test automation. Built testing frameworks reducing regression testing time by 70%. ISTQB certified tester.",
  },
  {
    id: 14,
    name: "Daniel Garcia",
    email: "daniel.garcia@email.com",
    phone: "+1-555-0114",
    category: "Blockchain Developer",
    skills: "Solidity, Ethereum, Smart Contracts, Web3, DeFi, NFT, Hardhat, Truffle, React, Node.js",
    experience: "4 years",
    location: "Miami, FL",
    education: "MS Computer Science, University of Miami",
    summary: "Blockchain developer specializing in Ethereum and DeFi protocols. Developed smart contracts managing $50M+ in assets. Active contributor to Web3 ecosystem.",
  },
  {
    id: 15,
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+1-555-0115",
    category: "Business Analyst",
    skills: "Business Analysis, Requirements Gathering, Process Improvement, SQL, Tableau, Excel, Stakeholder Management, Documentation",
    experience: "7 years",
    location: "Philadelphia, PA",
    education: "MBA, Wharton School",
    summary: "Business analyst with expertise in digital transformation projects. Led initiatives improving operational efficiency by 40%. Strong bridge between business and technology.",
  },
];

// OpenAI Embedding Service
class EmbeddingService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/embeddings';
    this.model = 'text-embedding-3-small';
  }

  async createEmbedding(text) {
    if (!this.apiKey || this.apiKey === 'demo_mode') {
      // Fallback to simple TF-IDF style embeddings
      return this.createSimpleEmbedding(text);
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          input: text
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.warn('Falling back to simple embeddings:', error);
      return this.createSimpleEmbedding(text);
    }
  }

  createSimpleEmbedding(text) {
    const tokens = text.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    const vocab = {};
    tokens.forEach(token => {
      vocab[token] = (vocab[token] || 0) + 1;
    });
    return vocab;
  }

  cosineSimilarity(vec1, vec2) {
    if (Array.isArray(vec1)) {
      // OpenAI embeddings
      let dotProduct = 0;
      let mag1 = 0;
      let mag2 = 0;
      for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
      }
      return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
    } else {
      // Simple embeddings
      const keys1 = Object.keys(vec1);
      const keys2 = Object.keys(vec2);
      const allKeys = [...new Set([...keys1, ...keys2])];

      let dotProduct = 0;
      let mag1 = 0;
      let mag2 = 0;

      allKeys.forEach(key => {
        const v1 = vec1[key] || 0;
        const v2 = vec2[key] || 0;
        dotProduct += v1 * v2;
        mag1 += v1 * v1;
        mag2 += v2 * v2;
      });

      if (mag1 === 0 || mag2 === 0) return 0;
      return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }
  }
}

// RAG Search Implementation
class RAGSearch {
  constructor(embeddingService) {
    this.embeddingService = embeddingService;
    this.profileEmbeddings = new Map();
  }

  async indexProfiles(profiles) {
    console.log('Indexing profiles...');
    for (const profile of profiles) {
      const profileText = `
        ${profile.name}
        ${profile.category}
        ${profile.skills}
        ${profile.summary}
        ${profile.education}
        ${profile.location}
        ${profile.experience}
      `;
      const embedding = await this.embeddingService.createEmbedding(profileText);
      this.profileEmbeddings.set(profile.id, embedding);
    }
    console.log('Indexing complete!');
  }

  async search(query, profiles, topK = 10) {
    const queryEmbedding = await this.embeddingService.createEmbedding(query);

    const scoredProfiles = profiles.map(profile => {
      const profileEmbedding = this.profileEmbeddings.get(profile.id);
      const similarity = this.embeddingService.cosineSimilarity(queryEmbedding, profileEmbedding);

      return {
        ...profile,
        relevanceScore: similarity
      };
    });

    return scoredProfiles
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);
  }
}

// Main App Component
export default function RAGProfileSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexing, setIsIndexing] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  const [ragSearch, setRagSearch] = useState(null);
  const [apiMode, setApiMode] = useState('demo');

  useEffect(() => {
    initializeRAG();
  }, []);

  const initializeRAG = async () => {
    try {
      // Check for OpenAI API key
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'demo_mode';
      const mode = apiKey === 'demo_mode' ? 'demo' : 'openai';
      setApiMode(mode);

      const embeddingService = new EmbeddingService(apiKey);
      const rag = new RAGSearch(embeddingService);

      await rag.indexProfiles(SAMPLE_PROFILES);
      setRagSearch(rag);
      setIsIndexing(false);
    } catch (error) {
      console.error('RAG initialization error:', error);
      setIsIndexing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !ragSearch) return;

    setIsSearching(true);

    try {
      const startTime = performance.now();
      const searchResults = await ragSearch.search(searchQuery, SAMPLE_PROFILES, 10);
      const endTime = performance.now();

      setResults(searchResults);
      setSearchStats({
        totalProfiles: SAMPLE_PROFILES.length,
        searchTime: (endTime - startTime).toFixed(2),
        resultsCount: searchResults.length
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

  if (isIndexing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Initializing RAG System</h2>
          <p className="text-gray-600">Creating embeddings for {SAMPLE_PROFILES.length} profiles...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-gray-600">Powered by Retrieval-Augmented Generation</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${apiMode === 'openai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                {apiMode === 'openai' ? '🚀 OpenAI Mode' : '⚡ Demo Mode'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {apiMode === 'openai' ? 'Using OpenAI Embeddings' : 'Using TF-IDF Embeddings'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* API Key Notice */}
        {apiMode === 'demo' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">Demo Mode Active</h3>
              <p className="text-sm text-yellow-800">
                Running with basic TF-IDF embeddings. For better results, add your OpenAI API key to <code className="bg-yellow-100 px-2 py-0.5 rounded">.env</code> file:
              </p>
              <code className="text-xs bg-yellow-100 px-3 py-1 rounded mt-2 inline-block">
                VITE_OPENAI_API_KEY=your_key_here
              </code>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for candidates... (e.g., 'Python developer with ML experience' or 'Senior React engineer')"
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
              <span>{searchStats.resultsCount} results found</span>
              <span>•</span>
              <span>Search time: {searchStats.searchTime}ms</span>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top Matches ({results.length})
            </h2>

            {results.map((profile, index) => (
              <div
                key={profile.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedProfile(selectedProfile?.id === profile.id ? null : profile)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                      <p className="text-blue-600 font-medium">{profile.category}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4" />
                      {(profile.relevanceScore * 100).toFixed(0)}% Match
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Rank #{index + 1}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{profile.summary}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.split(',').slice(0, 6).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                  {profile.skills.split(',').length > 6 && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      +{profile.skills.split(',').length - 6} more
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
                        <span className="text-sm">{profile.experience} experience</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600"><strong>Education:</strong> {profile.education}</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>All Skills:</strong></p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.split(',').map((skill, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                            {skill.trim()}
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
        )}

        {/* Empty State */}
        {!results.length && !isSearching && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Start Your Intelligent Search
            </h3>
            <p className="text-gray-500 mb-8">
              Enter keywords to find relevant candidates using RAG-powered semantic search
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Python developer with ML',
                  'React engineer AWS',
                  'Senior backend Java',
                  'Data scientist NLP',
                  'DevOps Kubernetes',
                  'Mobile developer iOS'
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

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 mt-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              How RAG Works
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Converts profiles to vector embeddings</li>
              <li>✅ Uses semantic similarity (not just keywords)</li>
              <li>✅ Ranks by relevance score</li>
              <li>✅ Understands context and meaning</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Dataset Info
            </h4>
            <p className="text-sm text-gray-700">
              Currently using {SAMPLE_PROFILES.length} sample profiles. Ready to connect to:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              <li>• Supabase / PostgreSQL</li>
              <li>• CSV / JSON files</li>
              <li>• Any database with REST API</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}