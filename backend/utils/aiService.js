import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Generate AI response using RAG
export const generateAIResponse = async (question, analysis) => {
    try {
        // Prepare context from analysis
        const context = `
Analysis Summary: ${analysis.summary}
Key Insights: ${analysis.keyInsights.join(', ')}
Data Columns: ${analysis.dataSource.metadata?.columns?.join(', ') || 'N/A'}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a data analyst assistant. Answer questions about the analyzed data based on the provided context."
                },
                {
                    role: "user",
                    content: `Context: ${context}\n\nQuestion: ${question}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('AI service error:', error);
        return 'Sorry, I could not generate a response at this time.';
    }
};

// Generate insights from data
export const generateInsights = async (data) => {
    try {
        const dataPreview = JSON.stringify(data.sampleData.slice(0, 10));
        const columns = data.columns.join(', ');

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a data analyst. Analyze the provided data and generate insights, summary, and suggest visualizations."
                },
                {
                    role: "user",
                    content: `Analyze this data:\nColumns: ${columns}\nSample: ${dataPreview}\n\nProvide: 1) Summary, 2) 3-5 key insights, 3) Suggest 2-3 chart types with their configurations.`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        // Parse AI response (simplified - would need structured output)
        const response = completion.choices[0].message.content;

        return {
            summary: response,
            keyInsights: ['Insight 1', 'Insight 2', 'Insight 3'],
            visualizations: [
                {
                    chartType: 'bar',
                    title: 'Sample Chart',
                    description: 'Auto-generated visualization',
                    data: data.sampleData.slice(0, 10),
                    config: {}
                }
            ]
        };
    } catch (error) {
        console.error('Insights generation error:', error);
        throw error;
    }
};
