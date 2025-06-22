import fs from 'fs';
import imagekit from '../config/imagekit.js';
import Property from '../models/propertymodel.js';

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, amenities, phone,affordability } = req.body;
        
        // Handle images
        const imageUrls = [];
        const imageFields = ['image1', 'image2', 'image3', 'image4'];
        
        // Get all image files
        const allFiles = Object.entries(req.files || {}).flatMap(([key, files]) => 
            imageFields.includes(key) ? (Array.isArray(files) ? files : [files]) : []
        );

        for (const image of allFiles) {
            const result = await imagekit.upload({
                file: fs.readFileSync(image.path),
                fileName: image.originalname,
                folder: "Property",
            });
            fs.unlink(image.path, (err) => {
                if (err) console.log("Error deleting the file: ", err);
            });
            imageUrls.push(result.url);
        }

        // Parse amenities if they're in string format
        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities.replace(/'/g, '"'));
            } catch (err) {
                console.log("Error parsing amenities:", err);
                parsedAmenities = [];
            }
        }

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities: parsedAmenities,
            image: imageUrls,
            phone,
            affordability
        });

        // Save the product to the database
        await product.save();

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        const property = await Property.find();
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, phone, amenities, existingImages,affordability } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id);
            return res.status(404).json({ message: "Property not found", success: false });
        }

        // Handle existing images
        const existingUrls = existingImages ? JSON.parse(existingImages) : property.image;

        // Handle new images
        const imageUrls = [];
        const imageFields = ['image1', 'image2', 'image3', 'image4'];
        
        // Get all image files
        const allFiles = Object.entries(req.files || {}).flatMap(([key, files]) => 
            imageFields.includes(key) ? (Array.isArray(files) ? files : [files]) : []
        );

        // Upload new images
        for (const image of allFiles) {
            const result = await imagekit.upload({
                file: fs.readFileSync(image.path),
                fileName: image.originalname,
                folder: "Property",
            });
            fs.unlink(image.path, (err) => {
                if (err) console.log("Error deleting the file: ", err);
            });
            imageUrls.push(result.url);
        }

        // Combine existing and new images
        const allImageUrls = [...existingUrls, ...imageUrls];
        // Ensure we don't exceed 4 images
        const finalImages = allImageUrls.slice(0, 4);

        // Parse amenities if they're in string format
        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities.replace(/'/g, '"'));
            } catch (err) {
                console.log("Error parsing amenities:", err);
                parsedAmenities = [];
            }
        }

        // Update property fields
        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.phone = phone;
        property.amenities = parsedAmenities;
        property.image = finalImages;
        property.affordability = affordability;

        await property.save();
        
        // Return success response
        return res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({ message: "Error updating property", success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ property, success: true });
    } catch (error) {
        console.error("Error fetching single property:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty, singleproperty };