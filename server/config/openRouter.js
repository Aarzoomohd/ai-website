const openRouterUrl="https://openrouter.ai/api/v1/chat/completions"
const model="deepseek/deepseek-chat"

const generateResponse=async (prompt)=>{
//     const res=await fetch(openRouterUrl, {
//   method: 'POST',
//   headers: {
//     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     model: model,
//     messages: [
//         {
//             role:"system",content:"You must return only valid raw JSON"
//         },
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//     temperature: 0.2
//   }),
// });
const controller = new AbortController();
const timeout = setTimeout(() => {
  controller.abort();
}, 60000); // 60 sec timeout

let res;

try {
  res = await fetch(openRouterUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON. No extra text."
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2
    }),
    signal: controller.signal
  });
} catch (err) {
  console.log("❌ FETCH ERROR:", err.message);
  throw err;
}

clearTimeout(timeout);

if(!res.ok){
    const err=await res.text()
    throw new Error("openrouter err"+err)
}
const data=await res.json()
const content = data?.choices?.[0]?.message?.content;

if (!content) {
  throw new Error("Invalid AI response");
}

return content;

}

const openRouterApiKey=process.env.OPENROUTER_API_KEY

export { generateResponse }