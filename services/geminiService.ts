
import { GoogleGenAI } from "@google/genai";
import { PreservationOptions, AnalysisResult, AspectRatio, SubjectType } from "../types";
import { compressImage } from "../utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNanoPrompt = async (
  styleImage: File,
  referenceImage: File | null,
  preservation: PreservationOptions,
  aspectRatio: AspectRatio,
  subjectType: SubjectType,
  userPrompt: string,
  negativePrompt: string
): Promise<AnalysisResult> => {
  try {
    const styleImageBase64 = await compressImage(styleImage);
    
    const parts: any[] = [
      {
        inlineData: {
          data: styleImageBase64,
          mimeType: 'image/jpeg',
        },
      }
    ];
    
    let specificInstructions = "";
    let negativePromptInstruction = "";

    // MODA GÖRE ÖZELLEŞTİRİLMİŞ TALİMATLAR
    if (subjectType === 'HUMAN') {
        // --- İNSAN MODU ---
        let faceInstruction = "";
        if (preservation.face) {
            faceInstruction = "KATI KİMLİK KORUMA (STRICT ID). Stil görselindeki kişinin yüzünü, biyometrik verilerini ve kimliğini %100 koru.";
        } else {
            if (referenceImage) {
                const refImageBase64 = await compressImage(referenceImage);
                parts.push({ inlineData: { data: refImageBase64, mimeType: 'image/jpeg' } });
                faceInstruction = "YÜZ TRANSFERİ (FACE SWAP). İkinci görsel referans yüzdür. Stil görselinin vücudunu koru, kafayı referans görsel ile değiştir.";
            } else {
                faceInstruction = "YÜZ VERİLERİNİ KORU (SOFT PRESERVE). Orijinal yüz hatlarını bozma, rastgele yüz oluşturma.";
            }
        }

        specificInstructions = `
            MOD: İNSAN / PORTRE (HUMAN FOCUSED)
            YÜZ TALİMATI: ${faceInstruction}
            
            DETAYLI İNSAN PROTOKOLLERİ:
            - YÜZ (Face): ${preservation.face ? "KORU" : "ESNEK"}
            - SAÇ (Style/Color): ${preservation.hairStyle ? "Stili koru" : ""} ${preservation.hairColor ? "Rengi koru" : ""}
            - GÖZ/BAKIŞ: ${preservation.eyeColor ? "Göz rengini koru" : ""} ${preservation.gaze ? "Bakış yönünü koru" : ""}
            - CİLT (Skin): ${preservation.skinTexture ? "Doku, ben, çil ve gözenekleri koru." : "Pürüzsüzleştirilebilir."}
            - VÜCUT (Body): ${preservation.bodyType ? "Vücut tipini ve anatomiyi koru." : "Standart."}
            - ELLER (Hands): ${preservation.hands ? "El ve parmak pozisyonlarını titizlikle koru." : "Otomatik."}
            - MAKYAJ/YAŞ: ${preservation.makeup ? "Makyaj stilini koru." : ""} ${preservation.age ? "Yaşı koru." : ""}
            - KIYAFET: ${preservation.clothes ? "Kıyafet detaylarını koru." : ""}
        `;
    } else {
        // --- NESNE / MANZARA MODU ---
        negativePromptInstruction = "Human face, eyes, skin, flesh, body parts, portrait, person"; // Yüz halüsinasyonunu engelle
        specificInstructions = `
            MOD: NESNE / MANZARA / SOYUT (OBJECT & SCENERY)
            ÖNEMLİ: Bu görselde İNSAN YÜZÜ YOKTUR ve OLMAMALIDIR. Pareidolia (yüze benzetme) yapma. Sadece nesne, yapı ve ortama odaklan.

            DETAYLI NESNE PROTOKOLLERİ:
            - MALZEME (Material): ${preservation.material ? "Materyal fiziğini (Metal, Ahşap, Plastik) tam analiz et." : "Serbest."}
            - DOKU (Texture): ${preservation.texture ? "Yüzey pürüzlerini ve dokusunu koru." : "Serbest."}
            - GEOMETRİ: ${preservation.geometry ? "Formu, köşeleri ve silüeti koru." : "Serbest."}
            - YANSIMA/IŞIK KIRILMASI: ${preservation.reflections ? "Yansımaları, cam/su etkilerini ve refraksiyonu koru." : "Serbest."}
            - ŞEFFAFLIK: ${preservation.transparency ? "Şeffaflık/Opaklık oranlarını koru." : "Serbest."}
            - ESKİME (Wear): ${preservation.wearAndTear ? "Kir, pas, çizik ve yaşanmışlık detaylarını koru." : "Temizle."}
            - YAZI/LOGO: ${preservation.typography ? "Yazı fontlarını koru." : ""} ${preservation.branding ? "Logoları koru." : ""}
            - DESEN (Pattern): ${preservation.pattern ? "Tekrar eden motifleri koru." : "Serbest."}
            - PERSPEKTİF: ${preservation.perspective ? "Kaçış noktalarını ve derinliği koru." : "Serbest."}
        `;
    }

    const systemPrompt = `
      Sen NanoHUNTER, görsel analiz AI asistanısın.
      
      ${specificInstructions}

      ORTAK PROTOKOLLER (Her iki mod için geçerli):
      - ORTAM: ${preservation.background ? "Arkaplanı koru" : ""} ${preservation.nature ? "Doğayı koru" : ""} ${preservation.architecture ? "Mimariyi koru" : ""}
      - ATMOSFER: ${preservation.lighting ? "Işıklandırmayı koru" : ""} ${preservation.colors ? "Renkleri koru" : ""} ${preservation.mood ? "Ruh halini koru" : ""}
      - TEKNİK: ${preservation.cameraAngle ? "Açıyı koru" : ""} ${preservation.depthOfField ? "Odak/Blur koru" : ""} ${preservation.lens ? "Lens mm koru" : ""}
      
      HEDEF BOYUT: ${aspectRatio}
      KULLANICI NOTU: "${userPrompt}"
      NEGATİF PROMPT: "${negativePrompt} ${negativePromptInstruction}"

      GÖREV:
      1. Görseli seçilen moda göre (İnsan veya Nesne) analiz et.
      2. Korunması istenen (TRUE olan) özellikleri detaylıca betimle.
      3. Nano Banana için optimize edilmiş İngilizce (promptEn) ve Türkçe (promptTr) prompt oluştur.
      4. Teknik terimler kullan (Cinematic lighting, Octane render, 8k textures vb.).

      Çıktı JSON olmalı:
      {
        "analysis": "Analiz özeti...",
        "promptEn": "Prompt text...",
        "promptTr": "Prompt metni..."
      }
    `;

    parts.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: { responseMimeType: 'application/json' }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini.");

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AnalysisResult;

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};
