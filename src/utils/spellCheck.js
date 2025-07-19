import axios from "axios";

const SPELL_CHECK_URL = "https://api.languagetool.org/v2/check";

export const checkSpelling = async (text) => {
  try {
    const response = await axios.post(SPELL_CHECK_URL, null, {
      params: {
        text,
        language: "en-US",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking spelling:", error);
    return { matches: [] };
  }
};
