const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const sizeOf = require('image-size');
const sharp = require('sharp');
require('dotenv').config();

// --- Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found. Please create a .env file and add your key.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Helper Functions ---

/**
 * Converts a local file to a GoogleGenerativeAI.Part object.
 * @param {string} filePath - Path to the local file.
 * @returns {{inlineData: {data: string, mimeType: string}}}
 */
function fileToGenerativePart(filePath) {
    const extension = path.extname(filePath).substring(1);
    const mimeTypeMap = {
        'png': 'image/png', 'jpeg': 'image/jpeg', 'jpg': 'image/jpeg', 'webp': 'image/webp'
    };
    const mimeType = mimeTypeMap[extension.toLowerCase()];
    if (!mimeType) {
        throw new Error(`Unsupported file type: ${extension}`);
    }
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
}

/**
 * Creates a smaller thumbnail version of an image for faster processing.
 * @param {string} originalPath - Path to the original image.
 * @returns {Promise<string>} - A promise that resolves with the path to the created thumbnail.
 */
async function createThumbnail(originalPath) {
    const parsedPath = path.parse(originalPath);
    const thumbPath = path.join(parsedPath.dir, `${parsedPath.name}-thumb${parsedPath.ext}`);
    
    await sharp(originalPath)
        .resize({
            width: 512,
            height: 512,
            fit: 'inside', // aintains aspect ratio
            withoutEnlargement: true,
        })
        .toFile(thumbPath);
    return thumbPath;
}

/**
 * Processes a single image: creates a thumb, gets a name from Gemini, renames the original, and cleans up.
 * @param {string} originalImagePath - The path to the original image to process.
 */
async function processImage(originalImagePath) {
    let thumbPath = null;
    try {
        // 1. Get dimensions of the ORIGINAL image to determine device type for the prompt.
        const dimensions = sizeOf(originalImagePath);
        const deviceType = dimensions.width >= dimensions.height ? "Desktop" : "Mobile";

        // 2. Create a temporary thumbnail for API submission.
        thumbPath = await createThumbnail(originalImagePath);

        // 3. Construct the specific prompt.
        const prompt = `Provide a good name for this image. The conditions are as follows -
1. All the spaces should be replaced with -
2. All the tags must be separated with _
3. The whole name itself should not repeat any thing unless needed like rather than keeping it like \`Satoru-Gojo-Vs-Sukuna_Satoru-Gojo_Sukuna\`, keep it like \`Satoru-Gojo_Ryomen-Sukuna_Fight\`
4. The first tag of the image name should be the name of anime/game/etc it belongs to, like \`Attack-On-Titan\`, \`Jujutsu-Kaisen\`, \`Your-Lie-In-April\`, \`Honkai-Star-Rail\` etc
5. The second part should have the character/machine/etc name if applicable and he/she is identifiable from the anime
6. The middle part should contain description which should be tried to be broken into tags when possible and tags should be kept free of redundancy
7. The last second tag should be Light or Dark i.e in which mode the image would suit better as the background
8. The last tag of the image name should be ${deviceType}
9. Provide Only Image Name and nothing else`;

        // 4. Prepare the THUMBNAIL image data for the API.
        const imagePart = fileToGenerativePart(thumbPath);

        // 5. Make the API call.
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const newNameBase = response.text().trim();

        if (!newNameBase) {
            console.error("   - Error: Gemini did not return a valid name.");
            return;
        }

        const sanitizedNameBase = newNameBase.replace(/[\/\\?%*:|"<>]/g, '-');

        // 6. Rename the ORIGINAL file.
        const fileExtension = path.extname(originalImagePath);
        const directory = path.dirname(originalImagePath);
        const newFilePath = path.join(directory, `${sanitizedNameBase}${fileExtension}`);

        fs.renameSync(originalImagePath, newFilePath);

        console.log(`\n✅ File successfully renamed!`);
        console.log(`${path.basename(originalImagePath)} -> ${path.basename(newFilePath)}\n`);

    } catch (error) {
        console.error(`\n   ❌ An error occurred while processing ${path.basename(originalImagePath)}:`, error.message);
    } finally {
        // 7. Clean up and delete the thumbnail file, regardless of success or failure.
        if (thumbPath && fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
        }
    }
}


/**
 * Main function to find and process all images in a directory.
 */
async function main() {
    const targetDir = process.argv[2] || '.'; // Use current directory if no argument is provided
    const absoluteDir = path.resolve(targetDir);

    if (!fs.existsSync(absoluteDir) || !fs.lstatSync(absoluteDir).isDirectory()) {
        console.error(`Error: Directory not found at ${absoluteDir}`);
        process.exit(1);
    }

    console.log(`Scanning for images in: ${absoluteDir}\n`);

    const supportedExtensions = new Set(['.png', '.jpeg', '.jpg', '.webp']);
    const allFiles = fs.readdirSync(absoluteDir);

    const imageFiles = allFiles.filter(file =>
        supportedExtensions.has(path.extname(file).toLowerCase()) &&
        !file.includes('-thumb.') // Exclude any leftover thumbnails
    );

    if (imageFiles.length === 0) {
        console.log("No images found to process.");
        return;
    }

    console.log(`Found ${imageFiles.length} image(s) to process.`);

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fullPath = path.join(absoluteDir, file);
        console.log(`\n=> Processing file ${i + 1} of ${imageFiles.length}: ${file}`);
        await processImage(fullPath);
    }

    console.log("\n--- Batch processing complete. ---");
}

main();