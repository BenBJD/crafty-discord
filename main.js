import Discord from "discord.js"
import dotenv from "dotenv"
import { makeRequest } from "./api.js"

dotenv.config()

const client = new Discord.Client()

client.ws.on("INTERACTION_CREATE", async interaction => {

    makeRequest(interaction).then(( message ) => {
        console.log(message)
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: message
                }
            }
        })
    })
})


client.login(process.env.BOT_TOKEN)
