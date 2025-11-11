import React from 'react';
import { Search, Loader2 } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, isSearching }) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search profiles... (e.g., 'Python developer', 'frontend engineer', 'ML expert')"
                className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none shadow-lg"
            />

            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />

            <button
                onClick={onSearch}
                disabled={isSearching}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSearching ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    'Search'
                )}
            </button>
        </div>
    );
};

export default SearchBar;