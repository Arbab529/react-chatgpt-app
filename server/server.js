import express from "express";
import cors from 'cors';
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "This is ChatGPT by Arbab!"
    })
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



app.post('/', async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.input,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log("Passed", req.body.input);
        res.status(200).send({
            bot: response.data.choices[0].text,
        })
    } catch (err) {
        console.log("Failed", req.body.input);
        console.error(err);
        res.status(500).send(err)
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})