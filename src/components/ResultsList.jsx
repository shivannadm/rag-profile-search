import React from 'react';
import { Search, User } from 'lucide-react';
import ProfileCard from './ProfileCard';

const ResultsList = ({ results, searchQuery, isSearching, onExampleSearch }) => {

  if (searchQuery && !isSearching && results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="text-gray-400" size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No profiles found</h3>
        <p className="text-gray-500">Try different search terms or keywords</p>
      </div>
    );
  }

  if (!searchQuery && results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-indigo-600" size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Search</h3>
        <p className="text-gray-500 mb-4">
          Try searching for skills, job titles, or locations
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Python developer', 'Frontend engineer', 'Data scientist', 'DevOps'].map((example) => (
            <button
              key={example}
              onClick={() => onExampleSearch(example)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {results.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            Found <span className="font-bold text-indigo-600">{results.length}</span> matching profiles
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </>
  );
};

export default ResultsList;