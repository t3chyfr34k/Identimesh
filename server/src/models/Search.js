import mongoose from 'mongoose'

const MatchPointsSchema = new mongoose.Schema(
  {
    username: Boolean,
    bio: Boolean,
    location: Boolean,
    joinDate: Boolean,
    postingPattern: Boolean,
  },
  { _id: false }
)

const MatchItemSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    platform: String,
    profilePic: String,
    bio: String,
    location: String,
    joinDate: Date,
    posts: Number,
    followers: Number,
    confidence: Number,
    matchPoints: MatchPointsSchema,
    status: { type: String, enum: ['pending', 'confirmed', 'flagged'], default: 'pending' },
    confirmedDate: Date,
    notes: String,
  },
  { _id: false }
)

const SourceProfileSchema = new mongoose.Schema(
  {
    username: String,
    platform: String,
    profilePic: String,
    bio: String,
    location: String,
    joinDate: Date,
    posts: Number,
    followers: Number,
  },
  { _id: false }
)

const SearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    searchDate: { type: Date, default: Date.now },
    sourceProfile: SourceProfileSchema,
    matches: [MatchItemSchema],
    searchTerm: String,
    totalMatches: Number,
  },
  { timestamps: true }
)

const Search = mongoose.models.Search || mongoose.model('Search', SearchSchema)
export default Search