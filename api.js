import axios from "axios"
import dotenv from "dotenv"
import https from 'https';

dotenv.config()

export const makeRequest = async (interaction) => {
    let response
    switch (interaction.data["options"][0]["name"]) {
        
        // Restart a server
        case "restart":
            response = await axios({
                method: "POST",
                url: `https://${process.env.API_ROOT}/api/v1/server/restart`,
                params: { "token": process.env.CRAFTY_TOKEN, "id": interaction.data["options"][0]["options"][0]["value"] },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })

            return `Restarted server ${interaction.data["options"][0]["options"][0]["value"]}`
        
        // List the players online in a server
        case "list-players":
            response = await axios({
                method: "GET",
                url: `https://${process.env.API_ROOT}/api/v1/server_stats`,
                params: { "token": process.env.CRAFTY_TOKEN },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
            // Get the players from the specified server
            let onlinePlayers
            for (let index = 0; index < response.data["data"].length; index++) {
                if (response.data["data"][index]["id"] === interaction.data["options"][0]["options"][0]["value"]) {
                    onlinePlayers = response.data["data"][index]["players"]
                }
            }
            // Format the string array from the API into a JS array
            onlinePlayers = onlinePlayers.split(",");
            onlinePlayers[0] = onlinePlayers[0].substring(1);
            onlinePlayers[onlinePlayers.length - 1] = onlinePlayers[onlinePlayers.length - 1].substring(
                0,
                onlinePlayers[onlinePlayers.length - 1].length - 1
            );
            onlinePlayers.forEach((x, i) => {
                onlinePlayers[i] = onlinePlayers[i].includes('"') ? onlinePlayers[i].replaceAll('"', "").trim()
                    : onlinePlayers[i].replaceAll("'", "").trim();
            });
            // Return message with newline characters after each comma
            return `Players online in server ${interaction.data["options"][0]["options"][0]["value"]}:\n ${onlinePlayers.toString().replaceAll(",", ",\n")}`
        
        // Return the full status of a server
        case "status":
            response = await axios({
                method: "GET",
                url: `https://${process.env.API_ROOT}/api/v1/server_stats`,
                params: { "token": process.env.CRAFTY_TOKEN },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
            
            let serverData
            for (let index = 0; index < response.data["data"].length; index++) {
                if (response.data["data"][index]["id"] === interaction.data["options"][0]["options"][0]["value"]) {
                    serverData = response.data["data"][index]
                }
            }

            return `${serverData["name"]}
            ID: ${serverData["id"]}
            Running: ${serverData["server_running"]}
            Version: ${serverData["server_version"]}
            Start time: ${serverData["server_start_time"]}
            CPU usage: ${serverData["cpu_usage"]}
            RAM usage: ${serverData["memory_usage"]}
            Online players: ${serverData["online_players"]}
            Max players: ${serverData["max_players"]}
            World size: ${serverData["world_size"]}
            `
        
        // List the servers with their IDs
        case "list-servers":
            response = await axios({
                method: "GET",
                url: `https://${process.env.API_ROOT}/api/v1/list_servers`,
                params: { "token": process.env.CRAFTY_TOKEN },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
            // Get the list
            let serverList = response.data["data"]["servers"]
            
            // Form and return message
            let message = ``
            for (let index = 0; index < serverList.length; index++) {
                message += `${serverList[index]["name"]}\n ID: ${serverList[index]["id"]}\n Running: ${serverList[index]["running"]}`
            }
            return message
        
        // Execute a command
        case "command":
            let allowedCommands = process.env.ALLOWED_COMMANDS.split(",")
            let id = interaction.data["options"][0]["options"][1]["value"]
            // Get the full command
            let command = interaction.data["options"][0]["options"][0]["value"]
            console.log(command)
            // Is this command allowed?
            let allowed = false
            for (let index = 0; index < allowedCommands.length; index++) {
                if (command.substr(0, command.indexOf(" ")) === allowedCommands[index]) {
                    allowed = true
                }
            }
            // Do or don't execute the command then return a message
            if (allowed) {
                response = await axios({
                    method: "POST",
                    url: `https://${process.env.API_ROOT}/api/v1/server/send_command`,
                    params: { "token": process.env.CRAFTY_TOKEN, "id": id },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    data: `command=${command}`
                })
                return `Executed ${command}`
            } else {
                return `Not allowed to use command '${command.substr(0, command.indexOf(" "))}'`
            }
        default:
            message = "you done fucked up"
            return message
    }
}
