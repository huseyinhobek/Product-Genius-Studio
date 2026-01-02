
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";
import { BusinessType, SceneStyle, ImageQuality } from "../types";

const getAi = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const IMAGE_MODEL = 'gemini-3-pro-image-preview';

const getBusinessInstruction = (type: BusinessType): string => {
  switch (type) {
    case 'Electronics': return "Focus on sleek surfaces, tech-ready lighting, and high-precision detail. Emphasize metallic or glass textures. Think flagship smartphone or luxury laptop photography.";
    case 'Footwear': return "Focus on dynamic angles, texture of the material (leather, fabric), and clean floor reflections. Athletic or luxury shoe boutique style.";
    case 'Fashion': return "Focus on fabric drape, soft lighting, and an elegant professional fashion studio environment. High-end apparel look.";
    case 'Lingerie': return "Focus on soft, intimate lighting, delicate shadows, and high-end boutique or silk-draped backgrounds. Sophisticated and tasteful.";
    case 'Handbags': return "Focus on luxury placement, premium leather sheen, and sophisticated accessory staging. High-end leather goods look.";
    case 'Jewelry': return "Focus on extreme sparkle, macro-detail, sharp focus, and dramatic 'black-box' or marble lighting. Diamond and gold brilliance.";
    case 'Accessories': return "Focus on fine details of hair accessories, clips, or small jewelry. Delicate lighting, sharp focus on small textures like pearls or velvet.";
    case 'HomeDecor': return "Focus on cozy interior aesthetics, natural light, and realistic room placement. Interior design magazine style.";
    case 'Cosmetics': return "Focus on clean, hygienic, splash effects or petal-soft textures and bright airy studio lighting. Premium skincare or makeup aesthetics.";
    default: return "Professional commercial product photography.";
  }
};

const getStyleInstruction = (style: SceneStyle): string => {
  switch (style) {
    case 'Studio': return "Pure white or soft grey professional cyclorama background, standard 3-point studio lighting, high commercial quality.";
    case 'Lifestyle': return "Placed in a realistic everyday high-end environment, warm natural lighting, shallow depth of field.";
    case 'Nature': return "Placed outdoors, organic elements like wood, stone, or water, golden hour sunlight.";
    case 'Luxury': return "Dark marble, gold accents, velvet textures, dramatic moody spotlighting, ultra-premium feel.";
    case 'Minimalist': return "Clean geometric shapes, monochromatic palette, soft shadows, plenty of negative space.";
    case 'Urban': return "Industrial concrete, city bokeh background, cool tones, modern edgy vibe.";
    default: return "Professional studio setup.";
  }
};

export const generateProductVisual = async (
  base64Image: string,
  businessType: BusinessType,
  style: SceneStyle,
  quality: ImageQuality,
  additionalPrompt: string
): Promise<string> => {
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  const businessInstr = getBusinessInstruction(businessType);
  const styleInstr = getStyleInstruction(style);

  const prompt = `
    TASK: High-end Professional Product Visualization.
    BUSINESS CONTEXT: ${businessType}.
    NICHE REQUIREMENTS: ${businessInstr}
    ENVIRONMENT STYLE: ${styleInstr}
    USER REQUEST: ${additionalPrompt}
    
    INSTRUCTION: Take the uploaded product image and place it in a professional commercial environment.
    Maintain the EXACT shape, color, and brand details of the product.
    Do not alter the product's identity. 
    Transform the lighting, shadows, and background into a world-class studio shot.
    The final output should look like a high-budget professional advertisement.
  `;

  const ai = getAi();
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: quality
      }
    }
  });

  // Find the image part in candidates
  for (const candidate of response.candidates || []) {
    for (const part of candidate.content.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("No image data returned from the model. Please check your API project permissions.");
};
