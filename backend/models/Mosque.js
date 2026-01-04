const mongoose = require('mongoose');

const mosqueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    imamName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    imamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    timings: {
        fajr: { type: String, required: true },
        dhuhr: { type: String, required: true },
        asr: { type: String, required: true },
        maghrib: { type: String, required: true },
        isha: { type: String, required: true },
        jummah: { type: String, required: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-save hook to generate slug
mosqueSchema.pre('save', async function (next) {
    if (!this.isModified('name') && this.slug) return next();

    if (!this.slug) {
        let baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        let slug = baseSlug;
        let counter = 1;

        // Check for uniqueness
        while (await mongoose.models.Mosque.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Index for faster queries
mosqueSchema.index({ imamId: 1, isActive: 1 });
mosqueSchema.index({ slug: 1 }, { unique: true });
mosqueSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Mosque', mosqueSchema);
