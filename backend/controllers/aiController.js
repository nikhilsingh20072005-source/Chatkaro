/*
==================================================
CHATKARO AI CONTROLLER
OLLAMA LOCAL AI
==================================================
*/

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5:3b";

/*
==================================================
ASK AI
POST /api/ai
==================================================
*/

const askAI = async (req, res) => {
  console.log(
    "================================="
  );

  console.log(
    "AI REQUEST:",
    req.body?.message
  );

  try {
    /*
    ==========================================
    GET MESSAGE
    ==========================================
    */

    const { message } =
      req.body;

    /*
    ==========================================
    VALIDATION
    ==========================================
    */

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    const userMessage =
      message.trim();

    console.log(
      "USER MESSAGE:",
      userMessage
    );

    /*
    ==========================================
    OLLAMA REQUEST
    ==========================================
    */

    console.log(
      "Trying Ollama model:",
      OLLAMA_MODEL
    );

    console.log(
      "Ollama URL:",
      OLLAMA_URL
    );

    const response = await fetch(
      `${OLLAMA_URL}/api/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: OLLAMA_MODEL,

          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],

          stream: false,
        }),
      }
    );

    /*
    ==========================================
    HTTP ERROR
    ==========================================
    */

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "OLLAMA HTTP ERROR:",
        response.status
      );

      console.error(
        "OLLAMA ERROR:",
        errorText
      );

      return res.status(503).json({
        success: false,

        message:
          "Local AI service is unavailable.",

        error:
          errorText ||
          "Ollama request failed",
      });
    }

    /*
    ==========================================
    RESPONSE JSON
    ==========================================
    */

    const data =
      await response.json();

    console.log(
      "OLLAMA RESPONSE RECEIVED"
    );

    /*
    ==========================================
    GET AI REPLY
    ==========================================
    */

    const reply =
      data?.message?.content;

    /*
    ==========================================
    EMPTY RESPONSE
    ==========================================
    */

    if (
      !reply ||
      !reply.trim()
    ) {
      console.error(
        "Ollama returned empty response"
      );

      return res.status(500).json({
        success: false,

        message:
          "Local AI returned an empty response",
      });
    }

    /*
    ==========================================
    SUCCESS
    ==========================================
    */

    console.log(
      "AI RESPONSE:",
      reply
    );

    console.log(
      "AI MODEL:",
      OLLAMA_MODEL
    );

    console.log(
      "================================="
    );

    return res.status(200).json({
      success: true,

      reply: reply.trim(),

      aiGenerated: true,

      aiModel: OLLAMA_MODEL,
    });

  } catch (error) {
    /*
    ==========================================
    ERROR
    ==========================================
    */

    console.error(
      "================================="
    );

    console.error(
      "OLLAMA ERROR"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "================================="
    );

    /*
    ==========================================
    CONNECTION ERROR
    ==========================================
    */

    if (
      error?.code ===
        "ECONNREFUSED" ||
      error?.cause?.code ===
        "ECONNREFUSED"
    ) {
      return res.status(503).json({
        success: false,

        message:
          "Ollama is not running. Please start Ollama first.",

        error:
          error?.message ||
          "Connection refused",
      });
    }

    /*
    ==========================================
    OTHER ERROR
    ==========================================
    */

    return res.status(500).json({
      success: false,

      message:
        "AI request failed",

      error:
        error?.message ||
        "Unknown Ollama error",
    });
  }
};

/*
==================================================
EXPORT
==================================================
*/

module.exports = {
  askAI,
};