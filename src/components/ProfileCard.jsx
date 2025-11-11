import React from 'react';
import { User, MapPin, Briefcase, Star } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
          <Star className="text-yellow-500" size={16} fill="currentColor" />
          <span className="text-sm font-semibold text-yellow-700">
            {profile.relevanceScore}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="text-gray-400" size={18} />
        <span className="font-semibold text-gray-800">{profile.title}</span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{profile.location}</span>
        </div>
        <div>
          <span className="font-medium">{profile.experience} years</span> experience
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {profile.summary}
      </p>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">SKILLS</p>
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{profile.skills.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;